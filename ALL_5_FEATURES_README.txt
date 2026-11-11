SMART DENGUE - 5 FEATURE PACKAGE

1. Appointment Notification: existing admin dashboard live appointment notifications (Firestore appointments collection).
2. QR Code Appointment Ticket: booking ticket now renders a QR code containing ticket ID, doctor, date and time; print button included. Requires internet for QRCodeJS CDN.
3. Dengue Risk Dashboard: assets/admin/pages/dengue-risk-dashboard.html; shows live appointment and symptom-check record counts. It intentionally does not fabricate geographic risk data.
4. Doctor Schedule Management: assets/admin/pages/doctor-schedule-management.html; admin can save schedule fields to public_doctors document. Requires sign-in and Firestore write permissions.
5. Dengue Prevention Tips: existing Prevention section retained on home page.

Open index.html with VS Code Live Server. Test with the project's Firebase configuration. The schedule manager requires the exact public_doctors document ID. Schedule data is saved but the booking flow has not been changed to enforce those schedules automatically. Review Firestore Rules before public deployment.


FIX: Dengue Risk Dashboard now checks Firebase Authentication and users/{uid}.role == admin before reading appointments and symptom_checks, matching the supplied Firestore Rules. Sign in as Admin before opening this page.
