# SwasthOne Demo Accounts

The demo accounts are created locally from the backend using:

```powershell
npm run seed:demo-users
```

This command uses `backend/.env` and upserts the demo users into the configured MongoDB database. It does not add an account-creation button to the UI.

| Role | Email | Password |
| --- | --- | --- |
| ASHA / ANM | `asha@swasthone.demo` | `Demo@123` |
| Doctor / Medical Officer | `doctor@swasthone.demo` | `Demo@123` |
| Administrator | `admin@swasthone.demo` | `Demo@123` |

These are prototype/demo credentials only. Change them before any shared or production deployment.

> This file is developer/project documentation only. It is not displayed inside the SwasthOne UI.

## Production note

Public sign-up only creates `patient` accounts. Staff accounts must be created by seeding or by an admin. The demo seed refuses to run when `NODE_ENV=production` unless `ALLOW_DEMO_SEED=true`; never seed these accounts into a database holding real data.
