'use client'

import { useState, useEffect } from 'react'
import { Car, Users, Droplets, BarChart3, Plus, Search, Phone, Calendar, TrendingUp, AlertCircle, DollarSign, Receipt, Trash2, Clock, Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Types
interface Vehicle {
  id: string
  plate: string
  ownerName: string
  phone: string
  type: 'car' | 'motorcycle'
  createdAt: string
  lastWash?: string
}

interface Employee {
  id: string
  name: string
  phone: string
  createdAt: string
}

interface Wash {
  id: string
  vehicleId: string
  employeeId: string
  value: number
  date: string
  notes?: string
}

interface Expense {
  id: string
  vehicleId: string
  description: string
  value: number
  date: string
  category: 'maintenance' | 'product' | 'other'
}

interface Schedule {
  id: string
  vehicleId: string
  dayOfWeek: number
  time: string
  createdAt: string
}

interface CarWashManagerProps {
  userRole: 'admin' | 'empresa'
}

export default function CarWashManager({ userRole }: CarWashManagerProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [washes, setWashes] = useState<Wash[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('vehicles')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null)
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingWash, setEditingWash] = useState<Wash | null>(null)
  const [deleteWashId, setDeleteWashId] = useState<string | null>(null)
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null)
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null)

  const isAdmin = userRole === 'admin'

  // Load data from localStorage
  useEffect(() => {
    const savedVehicles = localStorage.getItem('carwash_vehicles')
    const savedEmployees = localStorage.getItem('carwash_employees')
    const savedWashes = localStorage.getItem('carwash_washes')
    const savedExpenses = localStorage.getItem('carwash_expenses')
    const savedSchedules = localStorage.getItem('carwash_schedules')

    if (savedVehicles) setVehicles(JSON.parse(savedVehicles))
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees))
    if (savedWashes) setWashes(JSON.parse(savedWashes))
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
    if (savedSchedules) setSchedules(JSON.parse(savedSchedules))
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('carwash_vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    localStorage.setItem('carwash_employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem('carwash_washes', JSON.stringify(washes))
  }, [washes])

  useEffect(() => {
    localStorage.setItem('carwash_expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('carwash_schedules', JSON.stringify(schedules))
  }, [schedules])

  // Add Vehicle
  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setVehicles([...vehicles, newVehicle])
    toast.success('Veículo cadastrado com sucesso!')
  }

  // Delete Vehicle
  const deleteVehicle = (vehicleId: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para deletar!')
      return
    }
    setVehicles(vehicles.filter(v => v.id !== vehicleId))
    toast.success('Veículo removido com sucesso!')
    setDeleteVehicleId(null)
  }

  // Add Employee
  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setEmployees([...employees, newEmployee])
    toast.success('Funcionário cadastrado com sucesso!')
  }

  // Delete Employee
  const deleteEmployee = (employeeId: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para deletar!')
      return
    }
    setEmployees(employees.filter(e => e.id !== employeeId))
    toast.success('Funcionário removido com sucesso!')
    setDeleteEmployeeId(null)
  }

  // Add Wash
  const addWash = (wash: Omit<Wash, 'id' | 'date'>) => {
    const newWash: Wash = {
      ...wash,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setWashes([...washes, newWash])
    
    setVehicles(vehicles.map(v => 
      v.id === wash.vehicleId ? { ...v, lastWash: newWash.date } : v
    ))
    
    toast.success('Lavagem registrada com sucesso!')
  }

  // Update Wash
  const updateWash = (washId: string, updatedData: Partial<Wash>) => {
    setWashes(washes.map(w => 
      w.id === washId ? { ...w, ...updatedData } : w
    ))
    toast.success('Lavagem atualizada com sucesso!')
    setEditingWash(null)
  }

  // Delete Wash
  const deleteWash = (washId: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para deletar!')
      return
    }
    setWashes(washes.filter(w => w.id !== washId))
    toast.success('Lavagem removida com sucesso!')
    setDeleteWashId(null)
  }

  // Add Expense
  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setExpenses([...expenses, newExpense])
    toast.success('Despesa registrada com sucesso!')
  }

  // Update Expense
  const updateExpense = (expenseId: string, updatedData: Partial<Expense>) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId ? { ...e, ...updatedData } : e
    ))
    toast.success('Despesa atualizada com sucesso!')
    setEditingExpense(null)
  }

  // Delete Expense
  const deleteExpense = (expenseId: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para deletar!')
      return
    }
    setExpenses(expenses.filter(e => e.id !== expenseId))
    toast.success('Despesa removida com sucesso!')
    setDeleteExpenseId(null)
  }

  // Add Schedule
  const addSchedule = (schedule: Omit<Schedule, 'id' | 'createdAt'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setSchedules([...schedules, newSchedule])
    toast.success('Horário agendado com sucesso!')
  }

  // Delete Schedule
  const deleteSchedule = (scheduleId: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para deletar!')
      return
    }
    setSchedules(schedules.filter(s => s.id !== scheduleId))
    toast.success('Horário removido com sucesso!')
    setDeleteScheduleId(null)
  }

  // Get washes by employee for the week
  const getEmployeeWashes = (employeeId: string) => {
    return washes.filter(wash => wash.employeeId === employeeId).map(wash => {
      const vehicle = vehicles.find(v => v.id === wash.vehicleId)
      const washDate = new Date(wash.date)
      const dayOfWeek = washDate.getDay()
      
      return {
        ...wash,
        vehicle,
        dayOfWeek,
        dayName: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][dayOfWeek]
      }
    }).filter(wash => wash.dayOfWeek >= 1 && wash.dayOfWeek <= 6)
  }

  // Get total value of employee washes
  const getEmployeeWashesTotal = (employeeId: string) => {
    const employeeWashes = getEmployeeWashes(employeeId)
    return employeeWashes.reduce((sum, wash) => sum + wash.value, 0)
  }

  // Get washes by vehicle
  const getVehicleWashes = (vehicleId: string) => {
    return washes.filter(wash => wash.vehicleId === vehicleId).map(wash => {
      const employee = employees.find(e => e.id === wash.employeeId)
      const washDate = new Date(wash.date)
      const dayOfWeek = washDate.getDay()
      
      return {
        ...wash,
        employee,
        dayOfWeek,
        dayName: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][dayOfWeek]
      }
    })
  }

  // Get total value of vehicle washes
  const getVehicleWashesTotal = (vehicleId: string) => {
    const vehicleWashes = getVehicleWashes(vehicleId)
    return vehicleWashes.reduce((sum, wash) => sum + wash.value, 0)
  }

  // Get inactive clients
  const getInactiveClients = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    return vehicles.filter(vehicle => {
      if (!vehicle.lastWash) return true
      return new Date(vehicle.lastWash) < thirtyDaysAgo
    })
  }

  // Get monthly report
  const getMonthlyReport = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyWashes = washes.filter(wash => {
      const washDate = new Date(wash.date)
      return washDate.getMonth() === currentMonth && washDate.getFullYear() === currentYear
    })

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    const carWashes = monthlyWashes.filter(wash => {
      const vehicle = vehicles.find(v => v.id === wash.vehicleId)
      return vehicle?.type === 'car'
    }).length

    const motorcycleWashes = monthlyWashes.filter(wash => {
      const vehicle = vehicles.find(v => v.id === wash.vehicleId)
      return vehicle?.type === 'motorcycle'
    }).length

    const totalRevenue = monthlyWashes.reduce((sum, wash) => sum + wash.value, 0)
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.value, 0)

    return {
      carWashes,
      motorcycleWashes,
      totalWashes: monthlyWashes.length,
      totalRevenue,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
      washes: monthlyWashes,
      expenses: monthlyExpenses,
    }
  }

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.phone.includes(searchTerm)
  )

  const inactiveClients = getInactiveClients()
  const monthlyReport = getMonthlyReport()

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-xl">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lava-Jato Pro</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão Completo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar veículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total de Veículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{vehicles.length}</p>
                <Car className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{employees.length}</p>
                <Users className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Lavagens (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{monthlyReport.totalWashes}</p>
                <Droplets className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Receita (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">R$ {monthlyReport.totalRevenue.toFixed(2)}</p>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Despesas (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">R$ {monthlyReport.totalExpenses.toFixed(2)}</p>
                <Receipt className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="hidden sm:inline">Veículos</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Funcionários</span>
            </TabsTrigger>
            <TabsTrigger value="washes" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">Lavagens</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Despesas</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Veículos Cadastrados</CardTitle>
                    <CardDescription>Gerencie os veículos do lava-jato</CardDescription>
                  </div>
                  <VehicleDialog onAdd={addVehicle} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredVehicles.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum veículo cadastrado</p>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${vehicle.type === 'car' ? 'bg-blue-100' : 'bg-cyan-100'}`}>
                                <Car className={`w-6 h-6 ${vehicle.type === 'car' ? 'text-blue-600' : 'text-cyan-600'}`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{vehicle.plate}</h3>
                                <p className="text-sm text-gray-600">{vehicle.ownerName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{vehicle.phone}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={vehicle.type === 'car' ? 'default' : 'secondary'}>
                                {vehicle.type === 'car' ? 'Carro' : 'Moto'}
                              </Badge>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteVehicleId(vehicle.id)
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Funcionários</CardTitle>
                    <CardDescription>Gerencie a equipe do lava-jato</CardDescription>
                  </div>
                  <EmployeeDialog onAdd={addEmployee} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {employees.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum funcionário cadastrado</p>
                  ) : (
                    employees.map((employee) => (
                      <Card key={employee.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEmployee(employee)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-purple-100">
                                <Users className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{employee.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{employee.phone}</span>
                                </div>
                              </div>
                            </div>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteEmployeeId(employee.id)
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Washes Tab */}
          <TabsContent value="washes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registrar Lavagem</CardTitle>
                    <CardDescription>Adicione uma nova lavagem ao sistema</CardDescription>
                  </div>
                  <WashDialog 
                    vehicles={vehicles} 
                    employees={employees} 
                    onAdd={addWash} 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {washes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma lavagem registrada</p>
                  ) : (
                    washes.slice().reverse().map((wash) => {
                      const vehicle = vehicles.find(v => v.id === wash.vehicleId)
                      const employee = employees.find(e => e.id === wash.employeeId)
                      
                      return (
                        <Card key={wash.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-green-500">{vehicle?.plate || 'Veículo não encontrado'}</Badge>
                                  <Badge variant="outline">{employee?.name || 'Funcionário não encontrado'}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-semibold">R$ {wash.value.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(wash.date).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                </div>
                                {wash.notes && (
                                  <p className="text-sm text-gray-500 mt-2">{wash.notes}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingWash(wash)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {isAdmin && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteWashId(wash.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Despesas</CardTitle>
                    <CardDescription>Registre despesas relacionadas aos veículos</CardDescription>
                  </div>
                  <ExpenseDialog vehicles={vehicles} onAdd={addExpense} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma despesa registrada</p>
                  ) : (
                    expenses.slice().reverse().map((expense) => {
                      const vehicle = vehicles.find(v => v.id === expense.vehicleId)
                      
                      return (
                        <Card key={expense.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge>{vehicle?.plate || 'Veículo não encontrado'}</Badge>
                                  <Badge variant="outline">
                                    {expense.category === 'maintenance' ? 'Manutenção' : 
                                     expense.category === 'product' ? 'Produto' : 'Outro'}
                                  </Badge>
                                </div>
                                <p className="text-sm font-medium mb-1">{expense.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-semibold text-red-600">R$ {expense.value.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingExpense(expense)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {isAdmin && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteExpenseId(expense.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Monthly Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Relatório Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lavagens de Carros</span>
                      <span className="font-semibold">{monthlyReport.carWashes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lavagens de Motos</span>
                      <span className="font-semibold">{monthlyReport.motorcycleWashes}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total de Lavagens</span>
                      <span className="font-semibold text-lg">{monthlyReport.totalWashes}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Receita Total</span>
                      <span className="font-semibold text-green-600">R$ {monthlyReport.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Despesas Totais</span>
                      <span className="font-semibold text-red-600">R$ {monthlyReport.totalExpenses.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Lucro Líquido</span>
                      <span className={`font-bold text-lg ${monthlyReport.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {monthlyReport.profit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inactive Clients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Clientes Inativos
                  </CardTitle>
                  <CardDescription>Clientes sem lavagem há mais de 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  {inactiveClients.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhum cliente inativo</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {inactiveClients.map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium">{vehicle.plate}</p>
                            <p className="text-sm text-gray-600">{vehicle.ownerName}</p>
                          </div>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            {vehicle.lastWash 
                              ? `${Math.floor((Date.now() - new Date(vehicle.lastWash).getTime()) / (1000 * 60 * 60 * 24))} dias`
                              : 'Nunca lavou'
                            }
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Employee Washes Dialog */}
      {selectedEmployee && (
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lavagens de {selectedEmployee.name}</DialogTitle>
              <DialogDescription>Lavagens realizadas de segunda a sábado</DialogDescription>
            </DialogHeader>
            
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Valor Total da Semana</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {getEmployeeWashesTotal(selectedEmployee.id).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {getEmployeeWashes(selectedEmployee.id).length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma lavagem registrada esta semana</p>
              ) : (
                getEmployeeWashes(selectedEmployee.id).map((wash) => (
                  <Card key={wash.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge>{wash.vehicle?.plate || 'N/A'}</Badge>
                            <Badge variant="outline">{wash.dayName}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">R$ {wash.value.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(wash.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Vehicle Washes Dialog */}
      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lavagens do Veículo {selectedVehicle.plate}</DialogTitle>
              <DialogDescription>Histórico completo de lavagens</DialogDescription>
            </DialogHeader>
            
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Valor Total de Lavagens</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {getVehicleWashesTotal(selectedVehicle.id).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {getVehicleWashes(selectedVehicle.id).length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma lavagem registrada</p>
              ) : (
                getVehicleWashes(selectedVehicle.id).map((wash) => (
                  <Card key={wash.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge>{wash.employee?.name || 'N/A'}</Badge>
                            <Badge variant="outline">{wash.dayName}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">R$ {wash.value.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(wash.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmations */}
      <AlertDialog open={!!deleteEmployeeId} onOpenChange={() => setDeleteEmployeeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteEmployeeId && deleteEmployee(deleteEmployeeId)} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteVehicleId} onOpenChange={() => setDeleteVehicleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteVehicleId && deleteVehicle(deleteVehicleId)} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteWashId} onOpenChange={() => setDeleteWashId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta lavagem? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteWashId && deleteWash(deleteWashId)} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteExpenseId} onOpenChange={() => setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteExpenseId && deleteExpense(deleteExpenseId)} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteScheduleId} onOpenChange={() => setDeleteScheduleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteScheduleId && deleteSchedule(deleteScheduleId)} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Wash Dialog */}
      {editingWash && (
        <Dialog open={!!editingWash} onOpenChange={() => setEditingWash(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Lavagem</DialogTitle>
            </DialogHeader>
            <WashEditForm 
              wash={editingWash}
              vehicles={vehicles}
              employees={employees}
              onUpdate={(id, data) => updateWash(id, data)}
              onClose={() => setEditingWash(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Despesa</DialogTitle>
            </DialogHeader>
            <ExpenseEditForm 
              expense={editingExpense}
              vehicles={vehicles}
              onUpdate={(id, data) => updateExpense(id, data)}
              onClose={() => setEditingExpense(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Vehicle Dialog Component
function VehicleDialog({ onAdd }: { onAdd: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    plate: '',
    ownerName: '',
    phone: '',
    type: 'car' as 'car' | 'motorcycle',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ plate: '', ownerName: '', phone: '', type: 'car' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
          <DialogDescription>Adicione um novo veículo ao sistema</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plate">Placa</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
              placeholder="ABC-1234"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do Proprietário</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="João Silva"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Veículo</Label>
            <Select value={formData.type} onValueChange={(value: 'car' | 'motorcycle') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Carro</SelectItem>
                <SelectItem value="motorcycle">Moto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Cadastrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Employee Dialog Component
function EmployeeDialog({ onAdd }: { onAdd: (employee: Omit<Employee, 'id' | 'createdAt'>) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ name: '', phone: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
          <DialogDescription>Adicione um novo funcionário à equipe</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="João Silva"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          <Button type="submit" className="w-full">Cadastrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Wash Dialog Component
function WashDialog({ 
  vehicles, 
  employees, 
  onAdd 
}: { 
  vehicles: Vehicle[]
  employees: Employee[]
  onAdd: (wash: Omit<Wash, 'id' | 'date'>) => void 
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: '',
    employeeId: '',
    value: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      vehicleId: formData.vehicleId,
      employeeId: formData.employeeId,
      value: parseFloat(formData.value),
      notes: formData.notes,
    })
    setFormData({ vehicleId: '', employeeId: '', value: '', notes: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Lavagem
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nova Lavagem</DialogTitle>
          <DialogDescription>Adicione uma nova lavagem ao sistema</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo</Label>
            <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.ownerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee">Funcionário</Label>
            <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Detalhes adicionais..."
            />
          </div>
          <Button type="submit" className="w-full">Registrar Lavagem</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Wash Edit Form Component
function WashEditForm({ 
  wash, 
  vehicles, 
  employees, 
  onUpdate, 
  onClose 
}: { 
  wash: Wash
  vehicles: Vehicle[]
  employees: Employee[]
  onUpdate: (id: string, data: Partial<Wash>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    vehicleId: wash.vehicleId,
    employeeId: wash.employeeId,
    value: wash.value.toString(),
    notes: wash.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(wash.id, {
      vehicleId: formData.vehicleId,
      employeeId: formData.employeeId,
      value: parseFloat(formData.value),
      notes: formData.notes,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vehicle">Veículo</Label>
        <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.plate} - {vehicle.ownerName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="employee">Funcionário</Label>
        <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">Valor (R$)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Salvar</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  )
}

// Expense Dialog Component
function ExpenseDialog({ 
  vehicles, 
  onAdd 
}: { 
  vehicles: Vehicle[]
  onAdd: (expense: Omit<Expense, 'id' | 'date'>) => void 
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    value: '',
    category: 'product' as 'maintenance' | 'product' | 'other',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      vehicleId: formData.vehicleId,
      description: formData.description,
      value: parseFloat(formData.value),
      category: formData.category,
    })
    setFormData({ vehicleId: '', description: '', value: '', category: 'product' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Despesa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nova Despesa</DialogTitle>
          <DialogDescription>Adicione uma despesa relacionada a um veículo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo</Label>
            <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.ownerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value: 'maintenance' | 'product' | 'other') => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="product">Produto</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da despesa"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <Button type="submit" className="w-full">Registrar Despesa</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Expense Edit Form Component
function ExpenseEditForm({ 
  expense, 
  vehicles, 
  onUpdate, 
  onClose 
}: { 
  expense: Expense
  vehicles: Vehicle[]
  onUpdate: (id: string, data: Partial<Expense>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    vehicleId: expense.vehicleId,
    description: expense.description,
    value: expense.value.toString(),
    category: expense.category,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(expense.id, {
      vehicleId: formData.vehicleId,
      description: formData.description,
      value: parseFloat(formData.value),
      category: formData.category,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vehicle">Veículo</Label>
        <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.plate} - {vehicle.ownerName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.category} onValueChange={(value: 'maintenance' | 'product' | 'other') => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="product">Produto</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">Valor (R$)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Salvar</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  )
}
