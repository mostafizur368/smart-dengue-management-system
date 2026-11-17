# Task 94 — Role-Based Permission Hardening

## Implemented

- Appointment creation now requires an exact field allowlist and validates owner UID, patient/doctor text lengths, doctor ID, optional doctor UID, date/time format, initial `Pending` status and server timestamp.
- If `doctorUid` is supplied, Rules require a matching `users/{uid}` profile with `role=doctor` and an approved `public_doctors/{uid}` profile. A record is readable by an assigned doctor only when the signed-in account has the Doctor role and the public profile remains approved.
- Doctor appointment status updates remain restricted to the `status` field and the existing `Pending`, `Accepted` and `Rejected` values; Admin retains its existing management permission.
- Anonymous `contact_messages` and `symptom_checks` submissions remain available, but their fields, types and maximum lengths/counts are validated in Firestore Rules.
- User self-registration can create only the expected `name`, `email`, `role=user`, and `createdAt` profile fields.
- Ticket counters now carry `lastAppointmentId`. The ticket counter Rules require a matching appointment to be newly created in the same atomic Firestore transaction (`!exists` + `existsAfter` + `getAfter`).
- The browser booking transaction writes the appointment ID into the ticket counter record.
- Security session/event/alert/rate-limit collections are client-write-protected. Trusted Cloud Functions write them using the Admin SDK.

## Compatibility safeguards

- Public symptom checker and contact form remain anonymous.
- Existing appointment field names and `Pending` status are preserved.
- Existing ticket counter fields (`doctorId`, `appointmentDate`, `booked`, `total`, `updatedAt`) remain; `lastAppointmentId` is additive.
- Existing patient/doctor/admin role checks and health-record ownership rules remain in place.

## Required validation before deployment

Run the Firebase Emulator against the complete `firestore.rules` file. Test valid and invalid contact/symptom submissions, patient booking, a duplicate ticket attempt, a concurrent booking, doctor status update, patient cancellation, Admin update, and a counter write without a matching new appointment. Do not deploy the Rules if any existing supported flow fails.
