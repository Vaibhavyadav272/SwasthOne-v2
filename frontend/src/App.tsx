import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import PatientRegistration from "./pages/PatientRegistration";
import PatientProfile from "./pages/PatientProfile";
import Screening from "./pages/Screening";
import ScreeningStart from "./pages/ScreeningStart";
import LanguageSelector from "./components/LanguageSelector";
import { t, useLanguage } from "./i18n";
import RPPGScreening from "./pages/RPPGScreening";
import TrustScore from "./pages/TrustScore";
import Triage from "./pages/Triage";
import Referral from "./pages/Referral";
import ReferralTracking from "./pages/ReferralTracking";
import PatientRecordPage from "./pages/PatientRecord";
import FollowUp from "./pages/FollowUp";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import RoleDashboard from "./pages/RoleDashboard";
import AuthLanding from "./pages/AuthLanding";
import Signup from "./pages/Signup";
import Patients from "./pages/Patients";

import {
  Activity,
  Bell,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Plus,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import "./App.css";

function Dashboard() {
  useLanguage();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        {/* TOP HEADER */}
        <header className="topbar">
          <div>
            <p className="eyebrow">Thursday, 10 September 2026</p>

            <h1>{t("dashboard", "greeting")} 👋</h1>
          </div>

          <div className="topbar-actions">
            <LanguageSelector />

            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={21} />
              <span className="notification-dot" />
            </button>
          </div>
        </header>

        {/* WELCOME CARD */}
        <section className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-icon">
              <HeartPulse size={25} />
            </div>

            <div>
              <p className="welcome-label">{t("dashboard", "overview")}</p>

              <h2>{t("dashboard", "headline")}</h2>

              <p>{t("dashboard", "description")}</p>
            </div>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/patients/register")}
          >
            <Plus size={18} />
            {t("dashboard", "startScreening")}
          </button>
        </section>

        {/* STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon teal">
              <Users size={21} />
            </div>

            <div>
              <span className="stat-label">
                {t("dashboard", "patientsToday")}
              </span>

              <strong>24</strong>

              <small>{t("dashboard", "fromYesterday")}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Activity size={21} />
            </div>

            <div>
              <span className="stat-label">{t("dashboard", "screenings")}</span>

              <strong>18</strong>

              <small>{t("dashboard", "completed")}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Stethoscope size={21} />
            </div>

            <div>
              <span className="stat-label">{t("dashboard", "followUps")}</span>

              <strong>7</strong>

              <small>{t("dashboard", "dueToday")}</small>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="content-grid">
          {/* QUICK ACTIONS */}
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">
                  {t("dashboard", "patientWorkflow")}
                </p>

                <h3>{t("dashboard", "quickActions")}</h3>
              </div>
            </div>

            <div className="quick-actions">
              {/* REGISTER PATIENT */}
              <button
                className="action-card"
                type="button"
                onClick={() => navigate("/patients/register")}
              >
                <div className="action-icon">
                  <Users size={21} />
                </div>

                <div>
                  <strong>{t("dashboard", "registerPatient")}</strong>

                  <span>{t("dashboard", "registerDescription")}</span>
                </div>

                <ChevronRight size={18} />
              </button>

              {/* CONTINUE SCREENING */}
              <button
                className="action-card"
                type="button"
                onClick={() => navigate("/screening/start")}
              >
                <div className="action-icon">
                  <Activity size={21} />
                </div>

                <div>
                  <strong>{t("dashboard", "continueScreening")}</strong>

                  <span>{t("dashboard", "continueDescription")}</span>
                </div>

                <ChevronRight size={18} />
              </button>

              {/* VIEW REFERRALS */}
              <button
                className="action-card"
                type="button"
                onClick={() => navigate("/referral/tracking")}
              >
                <div className="action-icon">
                  <ClipboardList size={21} />
                </div>

                <div>
                  <strong>{t("dashboard", "viewReferrals")}</strong>

                  <span>{t("dashboard", "referralDescription")}</span>
                </div>

                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">
                  {t("dashboard", "recentActivity")}
                </p>

                <h3>{t("dashboard", "screeningStatus")}</h3>
              </div>

              <button
                className="text-button"
                type="button"
                onClick={() => navigate("/patients")}
              >
                {t("dashboard", "viewAll")}
              </button>
            </div>

            <div className="patient-list">
              <PatientRow
                initials="RK"
                name="Ramesh Kumar"
                time="10 min ago"
                status="Routine"
                statusClass="routine"
              />

              <PatientRow
                initials="SP"
                name="Sunita Patel"
                time="32 min ago"
                status="Consult"
                statusClass="consult"
              />

              <PatientRow
                initials="AM"
                name="Anil Mehta"
                time="1 hr ago"
                status="Urgent"
                statusClass="urgent"
              />
            </div>
          </section>
        </div>

        {/* TRUST BANNER */}
        <section className="trust-banner">
          <div className="trust-banner-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <strong>{t("dashboard", "trustTitle")}</strong>

            <p>{t("dashboard", "trustDescription")}</p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

/* =========================================================
   PATIENT ROW
   ========================================================= */

function PatientRow({
  initials,
  name,
  time,
  status,
  statusClass,
}: {
  initials: string;
  name: string;
  time: string;
  status: string;
  statusClass: string;
}) {
  return (
    <div className="patient-row">
      <div className="patient-avatar">{initials}</div>

      <div className="patient-info">
        <strong>{name}</strong>
        <span>{time}</span>
      </div>

      <span className={`status-pill ${statusClass}`}>
        {status === "Routine" && t("dashboard", "routine")}

        {status === "Consult" && t("dashboard", "consult")}

        {status === "Urgent" && t("dashboard", "urgent")}
      </span>
    </div>
  );
}

/* =========================================================
   APP ROUTES
   ========================================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<AuthLanding />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* GENERAL PROTECTED APPLICATION */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["patient", "asha", "doctor", "admin"]}
            />
          }
        >
          {/* MAIN DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />

          <Route path="/patients/register" element={<PatientRegistration />} />

          <Route path="/patients/profile" element={<PatientProfile />} />

          {/* SCREENING */}
          <Route path="/screening/start" element={<ScreeningStart />} />

          <Route path="/screening" element={<Screening />} />

          <Route path="/screening/rppg" element={<RPPGScreening />} />

          <Route path="/screening/trustscore" element={<TrustScore />} />

          <Route path="/screening/triage" element={<Triage />} />

          {/* REFERRALS */}
          <Route path="/referral" element={<Referral />} />

          <Route path="/referral/tracking" element={<ReferralTracking />} />

          {/* PATIENT RECORD */}
          <Route path="/patient-record" element={<PatientRecordPage />} />

          {/* FOLLOW-UP */}
          <Route path="/follow-up" element={<FollowUp />} />
        </Route>

        {/* PATIENT ROLE */}
        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient" element={<RoleDashboard role="patient" />} />
        </Route>

        {/* ASHA ROLE */}
        <Route element={<ProtectedRoute allowedRoles={["asha"]} />}>
          <Route path="/asha" element={<RoleDashboard role="asha" />} />
        </Route>

        {/* DOCTOR ROLE */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor" element={<RoleDashboard role="doctor" />} />
        </Route>

        {/* ADMIN ROLE */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<RoleDashboard role="admin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
