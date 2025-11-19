import './globals.css'
import Layout from './components/Layout'

export const metadata = {
  title: 'Dashboard API - JSONPlaceholder',
  description: 'Dashboard com dados da API pública JSONPlaceholder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}