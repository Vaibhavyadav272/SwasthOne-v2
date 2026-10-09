import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="placeholder-page">
      <main className="main-content">
        <div
          style={{
            maxWidth: '520px',
            margin: '80px auto',
            textAlign: 'center',
          }}
        >
          <ShieldAlert
            size={48}
            color="#dc2626"
            style={{ marginBottom: '16px' }}
          />

          <h1>Access restricted</h1>

          <p>
            You don't have permission to access this section of SwasthOne.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={() => navigate('/')}
          >
            Go to dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default Unauthorized