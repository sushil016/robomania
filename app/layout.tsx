import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { Inter, Orbitron } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '../components/Providers'
import { HeroBackground } from '@/components/HeroBackground'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata = {
  title: 'RoboMania 2025',
  description: 'Gear Up for the Ultimate Robot Battle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
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
      </body>
    </html>
  )
}

