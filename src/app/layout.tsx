import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { Inter, Orbitron } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '../components/Providers'
import { HeroBackground } from '@/components/HeroBackground'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import AuthSessionProvider from '@/components/AuthSessionProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata = {
  title: 'RoboMania 2025',
  description: 'Gear Up for the Ultimate Robot Battle',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <AuthSessionProvider>
          <SessionProvider session={session}>
            <Providers>
              <ThemeProvider>
                <div className="min-h-screen relative antialiased">
                  <HeroBackground />
                  <Header />
                  <main>{children}</main>
                  <Footer />
                </div>
              </ThemeProvider>
            </Providers>
          </SessionProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}

