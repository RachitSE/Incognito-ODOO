// components/Layout.tsx
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark">
      <main className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-6 py-12">{children}</div>
      </main>
    </div>
  );
}
