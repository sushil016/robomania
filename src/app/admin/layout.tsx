export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pt-32 pb-32">
      <div className="relative z-20">
        <main className="container mx-auto px-4">
          {children}
        </main>
      </div>
    </div>
  )
} 