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
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<number | 'all'>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users')
        ])

        const postsData = await postsRes.json()
        const usersData = await usersRes.json()

        setPosts(postsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.body.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = selectedUser === 'all' || post.userId === selectedUser
    return matchesSearch && matchesUser
  })

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Usuário Desconhecido'
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Posts</h1>
        <p className="text-gray-600">Gerencie todos os posts do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-blue-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-green-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Autores Únicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(posts.map(p => p.userId)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-purple-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Palavras Totais</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.reduce((total, post) => total + post.body.split(' ').length, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="bg-yellow-500 w-4 h-4 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Média por Autor</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(posts.length / new Set(posts.map(p => p.userId)).size)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Posts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Todos os Posts</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Buscar posts..."
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
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos os Autores</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              {filteredPosts.slice(0, 10).map((post) => (
                <div
                  key={post.id}
                  className={`p-6 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedPost?.id === post.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedPost(post)}
                >
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {post.body}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Por: {getUserName(post.userId)}</span>
                    <span>Post #{post.id}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Mostrando {Math.min(filteredPosts.length, 10)} de {filteredPosts.length} posts
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Carregar Mais
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes do Post */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedPost ? 'Detalhes do Post' : 'Selecione um Post'}
              </h2>
            </div>

            {selectedPost ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {selectedPost.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedPost.body}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Autor:</span>
                    <span className="text-gray-900 font-medium">
                      {getUserName(selectedPost.userId)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID do Post:</span>
                    <span className="text-gray-900">#{selectedPost.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID do Usuário:</span>
                    <span className="text-gray-900">{selectedPost.userId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Palavras:</span>
                    <span className="text-gray-900">
                      {selectedPost.body.split(' ').length}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Excluir
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Selecione um post para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}