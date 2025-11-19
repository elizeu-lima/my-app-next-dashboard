// app/components/Dashboard.tsx
'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface User {
  id: number
  name: string
  email: string
  phone: string
}

interface Todo {
  id: number
  title: string
  completed: boolean
  userId: number
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  
  // Estados para edição de tarefas
  const [editingTodo, setEditingTodo] = useState<number | null>(null)
  const [editedTodoTitle, setEditedTodoTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [postsRes, usersRes, todosRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts?_limit=6'),
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/todos?_limit=8')
        ])

        const postsData = await postsRes.json()
        const usersData = await usersRes.json()
        const todosData = await todosRes.json()

        setPosts(postsData)
        setUsers(usersData)
        setTodos(todosData)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Função para alternar conclusão da tarefa
  const toggleTodoCompletion = async (todoId: number) => {
    const todo = todos.find(t => t.id === todoId)
    if (!todo) return

    try {
      // Atualização otimista
      setTodos(prev => prev.map(t => 
        t.id === todoId ? { ...t, completed: !t.completed } : t
      ))

      // Chamada para API (simulada - JSONPlaceholder não persiste mudanças)
      await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: !todo.completed
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
    } catch (error) {
      // Reverter em caso de erro
      setTodos(prev => prev.map(t => 
        t.id === todoId ? { ...t, completed: todo.completed } : t
      ))
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  // Função para editar título da tarefa
  const updateTodoTitle = async (todoId: number) => {
    if (!editedTodoTitle.trim()) {
      setEditingTodo(null)
      return
    }

    try {
      setTodos(prev => prev.map(t => 
        t.id === todoId ? { ...t, title: editedTodoTitle } : t
      ))

      await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editedTodoTitle
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      setEditingTodo(null)
      setEditedTodoTitle('')
    } catch (error) {
      console.error('Erro ao editar tarefa:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { name: 'Total de Posts', value: posts.length, color: 'bg-blue-500' },
    { name: 'Total de Usuários', value: users.length, color: 'bg-green-500' },
    { name: 'Tarefas Pendentes', value: todos.filter(t => !t.completed).length, color: 'bg-yellow-500' },
    { name: 'Tarefas Concluídas', value: todos.filter(t => t.completed).length, color: 'bg-purple-500' }
  ]

  return (
    <div className="p-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className={`${stat.color} w-4 h-4 rounded-full mr-3`}></div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b">
          <nav className="flex -mb-px">
            {['posts', 'users', 'todos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'posts' && 'Posts'}
                {tab === 'users' && 'Usuários'}
                {tab === 'todos' && 'Tarefas'}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.body}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-blue-600">
                      User ID: {post.userId}
                    </span>
                    <span className="text-xs text-gray-500">
                      Post #{post.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {user.email}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {user.phone}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      ID: {user.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'todos' && (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodoCompletion(todo.id)}
                      className="h-4 w-4 text-blue-600 rounded mr-3 cursor-pointer"
                    />
                    
                    {editingTodo === todo.id ? (
                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          value={editedTodoTitle}
                          onChange={(e) => setEditedTodoTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateTodoTitle(todo.id)}
                          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => updateTodoTitle(todo.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mr-1 transition-colors"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setEditingTodo(null)
                            setEditedTodoTitle('')
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                        onDoubleClick={() => {
                          setEditingTodo(todo.id)
                          setEditedTodoTitle(todo.title)
                        }}
                      >
                        {todo.title}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingTodo(todo.id)
                        setEditedTodoTitle(todo.title)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <span className={`text-xs px-2 py-1 rounded ${
                      todo.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {todo.completed ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Informações da API */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Dados da API Pública
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Este dashboard consome dados da JSONPlaceholder API - uma API REST fake para testes e prototipagem.
              <br />
              <strong>Nota:</strong> As edições nas tarefas são apenas demonstrativas (a API não persiste mudanças).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}