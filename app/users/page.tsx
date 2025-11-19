'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
  company: {
    name: string
  }
  address: {
    street: string
    city: string
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Usuários</h1>
        <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-blue-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-green-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Domínios Únicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(users.map(u => u.email.split('@')[1])).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-purple-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Empresas</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(users.map(u => u.company.name)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-yellow-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cidades</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(users.map(u => u.address.city)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Usuários */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Todos os Usuários</h2>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-6 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs mt-1">{user.company.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalhes do Usuário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedUser ? 'Detalhes do Usuário' : 'Selecione um Usuário'}
              </h2>
            </div>

            {selectedUser ? (
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Informações de Contato</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Telefone:</span>
                        <span className="text-gray-900">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Website:</span>
                        <a href={`http://${selectedUser.website}`} className="text-blue-600 hover:text-blue-800">
                          {selectedUser.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Endereço</h4>
                    <div className="text-sm text-gray-900">
                      <p>{selectedUser.address.street}</p>
                      <p>{selectedUser.address.city}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Empresa</h4>
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{selectedUser.company.name}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Editar Usuário
                </button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-500">Selecione um usuário para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}