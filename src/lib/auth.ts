// Authentication system
export type UserRole = 'admin' | 'empresa'

export interface User {
  email: string
  role: UserRole
  name: string
}

// Credenciais padrão (em produção, use banco de dados)
const USERS = {
  admin: {
    email: 'admin@lavajato.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as UserRole,
  },
  empresa: {
    email: 'empresa@lavajato.com',
    password: 'empresa123',
    name: 'Empresa',
    role: 'empresa' as UserRole,
  },
}

export function login(email: string, password: string): User | null {
  const user = Object.values(USERS).find(
    (u) => u.email === email && u.password === password
  )

  if (user) {
    const userData: User = {
      email: user.email,
      role: user.role,
      name: user.name,
    }
    localStorage.setItem('carwash_user', JSON.stringify(userData))
    return userData
  }

  return null
}

export function logout() {
  localStorage.removeItem('carwash_user')
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('carwash_user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

export function isEmpresa(user: User | null): boolean {
  return user?.role === 'empresa'
}
