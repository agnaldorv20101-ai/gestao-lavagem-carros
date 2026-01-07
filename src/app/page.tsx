'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    
    if (!user) {
      router.push('/login')
    } else if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/empresa')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <p className="text-gray-600">Redirecionando...</p>
    </div>
  )
}
