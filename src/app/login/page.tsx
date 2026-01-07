'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Droplets, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { login, getCurrentUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Se já estiver logado, redireciona
    const user = getCurrentUser()
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/empresa')
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = login(formData.email, formData.password)

      if (user) {
        toast.success(`Bem-vindo, ${user.name}!`)
        
        // Redireciona baseado no tipo de usuário
        setTimeout(() => {
          if (user.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/empresa')
          }
        }, 500)
      } else {
        toast.error('Email ou senha incorretos!')
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl">
              <Droplets className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Lava-Jato Pro</CardTitle>
            <CardDescription className="text-base mt-2">
              Sistema de Gestão Completo
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Credenciais de Teste:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>ADM:</strong> admin@lavajato.com / admin123</p>
              <p><strong>Empresa:</strong> empresa@lavajato.com / empresa123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
