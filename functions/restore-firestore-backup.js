#!/usr/bin/env node
"use strict";

/**
 * Disaster-recovery restore helper.
 * Safe by default: dry-run only. Actual restore is limited to a fresh staging/test project.
 *
 * Required environment:
 *   RESTORE_TARGET_PROJECT_ID=<project-id-ending-in--staging-or--test>
 *   BACKUP_BUCKET=<private source bucket name>
 *   GOOGLE_APPLICATION_CREDENTIALS=<service account with source-bucket read and target-Firestore write>
 *
 * Usage:
 *   node restore-firestore-backup.js smart-dengue-firestore-backups/<run-id>
 *   CONFIRM_RESTORE_PROJECT_ID=<same target id> node restore-firestore-backup.js <prefix> --apply
 */
const crypto = require("node:crypto");
const {
  initializeApp,
  applicationDefault
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  GeoPoint,
  Bytes
} = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const prefix = process.argv[2] || "";
const apply = process.argv.includes("--apply");
const targetProjectId = String(process.env.RESTORE_TARGET_PROJECT_ID || "").trim();
const bucketName = String(process.env.BACKUP_BUCKET || "").trim();

function fail(message) {
  console.error(`RESTORE BLOCKED: ${message}`);
  process.exit(1);
}

if (!/^smart-dengue-firestore-backups\/[A-Za-z0-9T_-]+$/.test(prefix)) {
  fail("Provide a valid backup run prefix.");
}
if (!targetProjectId || !/-(staging|test)$/.test(targetProjectId)) {
  fail("RESTORE_TARGET_PROJECT_ID must name a separate project ending in -staging or -test. Production restore is deliberately blocked.");
}
if (!bucketName) fail("Set BACKUP_BUCKET to the private bucket containing the backup.");
if (apply && process.env.CONFIRM_RESTORE_PROJECT_ID !== targetProjectId) {
  fail("For --apply, CONFIRM_RESTORE_PROJECT_ID must exactly match RESTORE_TARGET_PROJECT_ID.");
}

initializeApp({
  credential: applicationDefault(),
  projectId: targetProjectId
});

const db = getFirestore();
const bucket = getStorage().bucket(bucketName);

function decodeValue(value) {
  if (value === null || value === undefined || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(decodeValue);
  if (value.__smdType === "timestamp") return new Timestamp(Number(value.seconds), Number(value.nanoseconds || 0));
  if (value.__smdType === "geoPoint") return new GeoPoint(Number(value.latitude), Number(value.longitude));
  if (value.__smdType === "documentReference") {
    if (typeof value.path !== "string" || value.path.split("/").length % 2 !== 0) {
      throw new Error("Invalid document reference in backup.");
    }
    return db.doc(value.path);
  }
  if (value.__smdType === "bytes") return Bytes.fromBase64String(value.base64);
  const result = {};
  for (const [key, child] of Object.entries(value)) result[key] = decodeValue(child);
  return result;
}

async function main() {
  const [manifestExists] = await bucket.file(`${prefix}/manifest.json`).exists();
  if (!manifestExists) fail("Manifest not found in source bucket.");

  const [manifestBuffer] = await bucket.file(`${prefix}/manifest.json`).download();
  const manifest = JSON.parse(manifestBuffer.toString("utf8"));
  if (manifest.schemaVersion !== 2 || manifest.backupFormat !== "smart-dengue-firestore-json-v2") {
    fail("Only verified schemaVersion 2 backups are supported by this restore tool. Legacy v1 backups require a separately reviewed migration.");
  }
  if (manifest.prefix !== prefix || !Array.isArray(manifest.objects) || !manifest.objects.length) {
    fail("Manifest metadata is incomplete or does not match the requested prefix.");
  }

  const records = [];
  for (const item of manifest.objects) {
    if (!item || typeof item.name !== "string" || !item.name.startsWith(`${prefix}/`) || item.name.includes("..")) {
      fail("Manifest contains an invalid object path.");
    }
    const [buffer] = await bucket.file(item.name).download();
    const digest = crypto.createHash("sha256").update(buffer).digest("hex");
    if (digest !== item.sha256 || buffer.length !== Number(item.byteSize)) {
      fail(`Checksum/size verification failed for ${item.name}.`);
    }
    const page = JSON.parse(buffer.toString("utf8"));
    if (page.schemaVersion !== 2 || !Array.isArray(page.records)) fail(`Invalid backup page: ${item.name}`);
    for (const record of page.records) {
      if (!record || typeof record.path !== "string" || record.path.split("/").length % 2 !== 0) {
        fail("Backup contains an invalid document path.");
      }
      records.push({ path: record.path, data: decodeValue(record.data) });
    }
  }

  if (records.length !== Number(manifest.documentCount)) {
    fail(`Manifest document count mismatch: manifest=${manifest.documentCount}, pages=${records.length}.`);
  }

  // Preflight all target documents before writing anything.
  const refs = records.map(item => db.doc(item.path));
  let existing = [];
  for (let i = 0; i < refs.length; i += 400) {
    const snapshots = await db.getAll(...refs.slice(i, i + 400));
    existing.push(...snapshots.filter(snapshot => snapshot.exists).map(snapshot => snapshot.ref.path));
  }
  if (existing.length) {
    fail(`${existing.length} target document(s) already exist. Restore will not overwrite them. First existing path: ${existing[0]}`);
  }

  console.log("BACKUP VERIFIED");
  console.log(`Source bucket: ${bucketName}`);
  console.log(`Target project: ${targetProjectId}`);
  console.log(`Documents: ${records.length}`);
  console.log(`Objects/checksums verified: ${manifest.objects.length}`);
  console.log(`Collections: ${(manifest.collectionPaths || []).length}`);

  if (!apply) {
    console.log("DRY RUN ONLY — no Firestore documents were written.");
    console.log("Review the target project, backup contents and access permissions before using --apply.");
    return;
  }

  let batch = db.batch();
  let count = 0;
  for (const record of records) {
    batch.create(db.doc(record.path), record.data);
    count += 1;
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  if (count % 400 !== 0) await batch.commit();
  console.log(`RESTORE COMPLETED: ${count} documents created in ${targetProjectId}.`);
  console.log("Run application-level verification before redirecting any users to this environment.");
}

main().catch(error => {
  console.error("RESTORE FAILED:", error && (error.code || error.message) || error);
  process.exitCode = 1;
});
