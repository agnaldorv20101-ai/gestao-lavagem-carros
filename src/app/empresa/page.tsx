'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout, isEmpresa } from '@/lib/auth'
import { LogOut, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CarWashManager from '@/components/CarWashManager'

export default function EmpresaPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    if (!isEmpresa(user)) {
      router.push('/admin')
      return
    }

    setUserName(user.name)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header com info do usuário */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                EMPRESA
              </Badge>
              <span className="text-sm text-gray-600">Olá, {userName}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <CarWashManager userRole="empresa" />
    </div>
  )
}
