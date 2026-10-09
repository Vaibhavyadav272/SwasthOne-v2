
## API contract updates

Core routes now follow the SwasthOne integration contract:

- `POST /api/auth/login`
- `POST /api/patients`
- `GET /api/patients/:id`
- `POST /api/screenings`
- `GET /api/screenings/:id`
- `POST /api/rppg` — TrustScore is `0-100`
- `POST /api/triage` — accepts `patientId`, `screeningId`, optional `historyScore`
- `GET /api/facilities`
- `POST /api/referrals` — requires `triageId`
- `POST /api/followups`
- `GET /api/followups/:patientId`
- `GET /api/records/:patientId`

Triage results are persisted in the `Triage` collection and linked to screenings/referrals.
