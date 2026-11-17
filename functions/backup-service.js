const crypto = require("node:crypto");
const {
  getFirestore,
  FieldPath,
  Timestamp,
  GeoPoint,
  Bytes
} = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const db = getFirestore();
const BACKUP_ROOT = "smart-dengue-firestore-backups";

function encodeFirestoreValue(value) {
  if (value === null || value === undefined) return value;
  if (value instanceof Timestamp) {
    return { __smdType: "timestamp", seconds: value.seconds, nanoseconds: value.nanoseconds };
  }
  if (value instanceof Date) {
    const timestamp = Timestamp.fromDate(value);
    return { __smdType: "timestamp", seconds: timestamp.seconds, nanoseconds: timestamp.nanoseconds };
  }
  if (value instanceof GeoPoint) {
    return { __smdType: "geoPoint", latitude: value.latitude, longitude: value.longitude };
  }
  if (value instanceof Bytes) {
    return { __smdType: "bytes", base64: value.toBase64() };
  }
  if (typeof value === "object" && typeof value.path === "string" && value.firestore) {
    return { __smdType: "documentReference", path: value.path };
  }
  if (Array.isArray(value)) return value.map(encodeFirestoreValue);
  if (typeof value === "object") {
    const output = {};
    for (const [key, child] of Object.entries(value)) {
      if (child !== undefined) output[key] = encodeFirestoreValue(child);
    }
    return output;
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(value);
}

async function backupCollection(collectionRef, bucket, runPrefix, counters) {
  let cursor = null;
  let page = 0;
  do {
    let request = collectionRef.orderBy(FieldPath.documentId()).limit(400);
    if (cursor) request = request.startAfter(cursor);
    const snapshot = await request.get();
    if (snapshot.empty) break;

    const records = [];
    for (const document of snapshot.docs) {
      records.push({
        id: document.id,
        path: document.ref.path,
        data: encodeFirestoreValue(document.data())
      });
      counters.documents += 1;
      const subcollections = await document.ref.listCollections();
      for (const subcollection of subcollections) {
        await backupCollection(subcollection, bucket, runPrefix, counters);
      }
    }

    const objectName = `${runPrefix}/${collectionRef.path.replaceAll("/", "__")}-part-${String(page).padStart(4, "0")}.json`;
    const body = stableJson({
      schemaVersion: 2,
      backupFormat: "smart-dengue-firestore-json-v2",
      collectionPath: collectionRef.path,
      page,
      exportedAt: new Date().toISOString(),
      records
    });
    const sha256 = crypto.createHash("sha256").update(body).digest("hex");
    const byteSize = Buffer.byteLength(body, "utf8");

    await bucket.file(objectName).save(body, {
      resumable: false,
      metadata: {
        contentType: "application/json",
        cacheControl: "private, no-store",
        metadata: {
          backupFormat: "smart-dengue-firestore-json-v2",
          sha256
        }
      },
      preconditionOpts: { ifGenerationMatch: 0 }
    });

    counters.files += 1;
    counters.objects.push({
      name: objectName,
      sha256,
      byteSize,
      recordCount: records.length,
      collectionPath: collectionRef.path
    });
    counters.collections.add(collectionRef.path);
    cursor = snapshot.docs[snapshot.docs.length - 1];
    page += 1;
  } while (snapshot.size === 400);
}

function validateRunPrefix(prefix) {
  return typeof prefix === "string"
    && prefix.startsWith(`${BACKUP_ROOT}/`)
    && prefix.split("/").length === 2
    && !prefix.includes("..")
    && /^[A-Za-z0-9T_-]+$/.test(prefix.slice(BACKUP_ROOT.length + 1));
}

async function runFirestoreBackup(trigger = "scheduled") {
  const bucketName = process.env.BACKUP_BUCKET;
  const bucket = bucketName ? getStorage().bucket(bucketName) : getStorage().bucket();
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const runPrefix = `${BACKUP_ROOT}/${runId}`;
  const runRef = db.collection("system_backup_runs").doc(runId);
  const startedAt = new Date();
  const counters = {
    documents: 0,
    files: 0,
    collections: new Set(),
    objects: []
  };

  await runRef.set({
    runId,
    trigger,
    status: "running",
    bucket: bucket.name,
    prefix: runPrefix,
    startedAt,
    completedAt: null,
    documentCount: 0,
    fileCount: 0,
    collectionCount: 0,
    errorCode: null
  });

  try {
    const collections = await db.listCollections();
    for (const collectionRef of collections) {
      await backupCollection(collectionRef, bucket, runPrefix, counters);
    }

    const manifest = {
      schemaVersion: 2,
      backupFormat: "smart-dengue-firestore-json-v2",
      createdAt: new Date().toISOString(),
      projectId: process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || "unknown",
      bucket: bucket.name,
      prefix: runPrefix,
      collectionPaths: [...counters.collections].sort(),
      documentCount: counters.documents,
      fileCount: counters.files,
      objects: counters.objects,
      integrity: "sha256-per-object",
      restorePolicy: "Restore only to a separate staging/test Firebase project after a dry-run and explicit confirmation."
    };

    const manifestBody = JSON.stringify(manifest, null, 2);
    await bucket.file(`${runPrefix}/manifest.json`).save(manifestBody, {
      resumable: false,
      metadata: {
        contentType: "application/json",
        cacheControl: "private, no-store",
        metadata: { backupFormat: "smart-dengue-firestore-manifest-v2" }
      },
      preconditionOpts: { ifGenerationMatch: 0 }
    });

    const completedAt = new Date();
    await runRef.set({
      status: "completed",
      completedAt,
      documentCount: counters.documents,
      fileCount: counters.files,
      collectionCount: counters.collections.size,
      manifestSha256: crypto.createHash("sha256").update(manifestBody).digest("hex"),
      errorCode: null
    }, { merge: true });

    return {
      runId,
      prefix: runPrefix,
      bucket: bucket.name,
      documentCount: counters.documents,
      fileCount: counters.files,
      collectionCount: counters.collections.size,
      status: "completed"
    };
  } catch (error) {
    const errorCode = String(error && (error.code || error.name) || "backup_failed").slice(0, 80);
    await runRef.set({
      status: "failed",
      completedAt: new Date(),
      documentCount: counters.documents,
      fileCount: counters.files,
      collectionCount: counters.collections.size,
      errorCode
    }, { merge: true }).catch(() => {});
    const incidentId = `auto_backup_${Math.floor(Date.now() / (15 * 60 * 1000))}`;
    const incidentRef = db.collection("security_incidents").doc(incidentId);
    await incidentRef.create({
      category: "backup_recovery",
      severity: "high",
      title: "Scheduled Firestore backup failed",
      description: `Backup run ${runId} failed with code ${errorCode}. Review Cloud Functions logs and backup bucket permissions.`,
      source: "scheduled_backup",
      status: "open",
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null
    }).catch(failure => {
      if (failure.code !== 6 && failure.code !== "already-exists") {
        // Preserve the original backup error; incident logging is best-effort.
      }
    });
    throw error;
  }
}

async function verifyBackupRun(runPrefix) {
  if (!validateRunPrefix(runPrefix)) {
    const error = new Error("Invalid backup run prefix.");
    error.code = "invalid-argument";
    throw error;
  }

  const bucketName = process.env.BACKUP_BUCKET;
  const bucket = bucketName ? getStorage().bucket(bucketName) : getStorage().bucket();
  const manifestFile = bucket.file(`${runPrefix}/manifest.json`);
  const [exists] = await manifestFile.exists();
  if (!exists) {
    const error = new Error("Backup manifest not found.");
    error.code = "not-found";
    throw error;
  }

  const [manifestBuffer] = await manifestFile.download();
  const manifest = JSON.parse(manifestBuffer.toString("utf8"));
  if (manifest.prefix !== runPrefix) {
    const error = new Error("Manifest prefix does not match requested backup.");
    error.code = "failed-precondition";
    throw error;
  }

  // Legacy Task 89 manifests did not contain object-level hashes.
  if (manifest.schemaVersion !== 2 || !Array.isArray(manifest.objects)) {
    const [files] = await bucket.getFiles({ prefix: `${runPrefix}/` });
    return {
      verified: false,
      verificationType: "legacy-presence-only",
      message: "Legacy backup detected. Object-level SHA-256 checksums are unavailable; presence-only verification is not a restore guarantee.",
      expectedFiles: Number(manifest.fileCount || 0),
      foundFiles: files.filter(file => file.name !== `${runPrefix}/manifest.json`).length,
      documentCount: Number(manifest.documentCount || 0)
    };
  }

  if (manifest.objects.length > 500) {
    const error = new Error("Backup contains too many objects for an interactive verification. Use the CLI restore/verification workflow.");
    error.code = "resource-exhausted";
    throw error;
  }

  let verified = 0;
  const failures = [];
  for (const object of manifest.objects) {
    if (!object || typeof object.name !== "string"
      || !object.name.startsWith(`${runPrefix}/`) || object.name.includes("..")) {
      failures.push("invalid-object-path");
      continue;
    }
    try {
      const [buffer] = await bucket.file(object.name).download();
      const digest = crypto.createHash("sha256").update(buffer).digest("hex");
      if (digest !== object.sha256 || buffer.length !== Number(object.byteSize)) {
        failures.push(object.name.slice(runPrefix.length + 1, runPrefix.length + 100));
      } else {
        verified += 1;
      }
    } catch (error) {
      failures.push(String(error && error.code || "object-read-failed").slice(0, 80));
    }
  }

  return {
    verified: failures.length === 0 && verified === manifest.objects.length,
    verificationType: "sha256-per-object",
    expectedFiles: manifest.objects.length,
    verifiedFiles: verified,
    failedFiles: failures.slice(0, 30),
    documentCount: Number(manifest.documentCount || 0),
    collectionCount: Array.isArray(manifest.collectionPaths) ? manifest.collectionPaths.length : 0
  };
}

module.exports = {
  runFirestoreBackup,
  verifyBackupRun,
  encodeFirestoreValue,
  validateRunPrefix
};
