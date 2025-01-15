export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="">
      <main className="p-16">{children}</main>
    </div>
  )
} 