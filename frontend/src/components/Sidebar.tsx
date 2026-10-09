import {
  Activity,
  ClipboardList,
  FileHeart,
  Home,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearAuth, getStoredUser } from '../services/api'

interface SidebarProps {
  activeItem?: string
}

type FrontendRole = 'patient' | 'asha' | 'doctor' | 'admin'

function Sidebar({ activeItem = 'Dashboard' }: SidebarProps) {
  const navigate = useNavigate()
  const user = getStoredUser()
  const role: FrontendRole = user?.role === 'health_worker' ? 'asha' : (user?.role || 'patient') as FrontendRole

  const menuByRole: Record<FrontendRole, { label: string; icon: typeof Home; path: string }[]> = {
    patient: [
      { label: 'Dashboard', icon: Home, path: '/patient' },
      { label: 'My Profile', icon: Users, path: '/patients' },
      { label: 'Screening', icon: Activity, path: '/screening/start' },
      { label: 'Referrals', icon: ClipboardList, path: '/patients' },
      { label: 'Health Records', icon: FileHeart, path: '/patients' },
    ],
    asha: [
      { label: 'Dashboard', icon: Home, path: '/asha' },
      { label: 'Patients', icon: Users, path: '/patients' },
      { label: 'Screening', icon: Activity, path: '/patients' },
      { label: 'Referrals', icon: ClipboardList, path: '/referral/tracking' },
      { label: 'Health Records', icon: FileHeart, path: '/patients' },
    ],
    doctor: [
      { label: 'Dashboard', icon: Home, path: '/doctor' },
      { label: 'Patients', icon: Users, path: '/patients' },
      { label: 'Screening', icon: Activity, path: '/patients' },
      { label: 'Referrals', icon: ClipboardList, path: '/referral/tracking' },
      { label: 'Health Records', icon: FileHeart, path: '/patients' },
    ],
    admin: [
      { label: 'Dashboard', icon: Home, path: '/admin' },
      { label: 'Patients', icon: Users, path: '/patients' },
      { label: 'Screening', icon: Activity, path: '/patients' },
      { label: 'Referrals', icon: ClipboardList, path: '/referral/tracking' },
      { label: 'Health Records', icon: FileHeart, path: '/patients' },
    ],
  }

  const menuItems = menuByRole[role]

  const handleLogout = () => {
    clearAuth()
    navigate('/', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Activity size={22} />
        </div>
        <div>
          <div className="brand-name">SwasthOne</div>
          <div className="brand-tagline">Healthcare, closer to you</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className={`nav-item ${activeItem === item.label ? 'active' : ''}`}
              type="button"
              onClick={() => navigate(item.path)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" type="button" onClick={() => navigate(role === 'admin' ? '/admin' : `/${role}`)}>
          <Settings size={19} />
          <span>Settings</span>
        </button>
        <button className="nav-item logout" type="button" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
