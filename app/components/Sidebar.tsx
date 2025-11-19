'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/reports', label: 'Relatórios', icon: '📈' },
    { href: '/users', label: 'Usuários', icon: '👥' },
    { href: '/posts', label: 'Posts', icon: '📝' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Dashboard API</h1>
        <p className="text-sm text-gray-600 mt-1">Sistema de Gestão</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              pathname === item.href ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Status da API */}
      <div className="mt-8 mx-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-green-800 font-medium">API Online</span>
        </div>
        <p className="text-xs text-green-600 mt-1">JSONPlaceholder</p>
      </div>
    </div>
  )
}