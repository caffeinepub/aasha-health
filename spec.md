# Aasha Health

## Current State
New project, no existing application files.

## Requested Changes (Diff)

### Add
- Patient registration with encrypted personal information (name, age, blood type, medical notes, emergency contact)
- Auto-generated unique Patient ID for each patient
- QR code generation tied to each patient's ID
- QR code scanner to look up patient by scanning their QR code
- Emergency call button that dials a configurable emergency number
- Patient profile view showing decrypted info when authorized
- Role-based access: admin can add/edit patients, staff can view/scan
- Dashboard: total patients, recent registrations, quick access actions

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Patient data model: id (auto UUID), name (encrypted), age (encrypted), bloodType, medicalNotes (encrypted), emergencyContact (encrypted), emergencyPhone, createdAt
   - APIs: addPatient, getPatient, getAllPatients, updatePatient, deletePatient, searchPatientById
   - Authorization integration: admin and staff roles
   - Patient ID generation: short alphanumeric ID (e.g. AASHA-XXXXX)

2. Frontend (React):
   - Landing/login page
   - Dashboard with stats cards and quick actions
   - Patient list page
   - Add/Edit patient form with encrypted fields
   - Patient detail page showing profile + generated QR code for their ID
   - QR code scanner page (camera-based)
   - Emergency call button (prominent red button) in header/dashboard
   - QR code display component per patient
