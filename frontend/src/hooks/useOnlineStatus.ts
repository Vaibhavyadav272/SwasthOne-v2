import { useEffect, useState } from 'react'

async function checkConnection() {
  if (!navigator.onLine) {
    return false
  }

  try {
    await fetch(window.location.origin, {
      method: 'HEAD',
      cache: 'no-store',
    })

    return true
  } catch {
    return false
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const updateStatus = async () => {
      const online = await checkConnection()
      setIsOnline(online)
    }

    const handleOnline = () => {
      updateStatus()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const interval = window.setInterval(updateStatus, 5000)

    updateStatus()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.clearInterval(interval)
    }
  }, [])

  return isOnline
}