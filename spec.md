# Aasha Health

## Current State
- Patients stored globally; all users see all patients
- QR code generated via external API (api.qrserver.com) -- unreliable
- QR scanner reads patient ID and calls getPatient(id)
- Backend has no concept of patient ownership

## Requested Changes (Diff)

### Add
- `owner: Principal` field on PatientRecord to track who added the patient
- `getPatient` checks ownership: only the owner or an admin can view
- Local QR code generation using `qrcode` npm library (no external API calls)

### Modify
- `addPatient`: store `caller` as `owner` on the record
- `listPatients`: returns only the caller's own patients; admins get all
- `getPatient`: enforces ownership check (owner or admin only)
- `updatePatient`: enforces ownership check
- `deletePatient`: admin only (unchanged behavior)
- PatientDetailPage: replace external QR image with canvas-rendered QR via `qrcode` library

### Remove
- Dependency on `https://api.qrserver.com` for QR code images

## Implementation Plan
1. Update backend `PatientRecord` type to include `owner: Principal`
2. Update `addPatient` to capture `caller` as `owner`
3. Update `listPatients` to filter by `owner == caller` unless admin
4. Update `getPatient` and `updatePatient` to check `owner == caller || isAdmin`
5. Add `qrcode` npm package to frontend
6. Replace `QRCodeImage` component in PatientDetailPage with canvas-based local rendering
7. Ensure QR scanner still passes raw patientId string to getPatient lookup
