import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { Inter, Orbitron } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


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
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

