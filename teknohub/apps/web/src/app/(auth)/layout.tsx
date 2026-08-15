export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10 bg-background min-h-[calc(100vh-10rem)]">
      {children}
    </main>
  );
}
