import { Activity, ClipboardList, FileHeart, Home, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser } from '../services/api'

function BottomNav() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const role = user?.role === 'health_worker' ? 'asha' : (user?.role || 'patient')
  const home = role === 'admin' ? '/admin' : `/${role}`

  const items = [
    { label: 'Home', icon: Home, path: home },
    { label: 'Patients', icon: Users, path: '/patients' },
    { label: 'Screen', icon: Activity, path: '/patients' },
    { label: 'Referrals', icon: ClipboardList, path: '/referral/tracking' },
    { label: 'Records', icon: FileHeart, path: '/patients' },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(({ label, icon: Icon, path }, index) => (
        <button key={label} className={`bottom-nav-item ${index === 0 ? 'active' : ''}`} type="button" onClick={() => navigate(path)}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
