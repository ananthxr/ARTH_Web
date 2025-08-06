// Layout component - provides consistent header and navigation across pages
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <div>
      {/* Header section with title and description */}
      <header className="header">
        <div className="container">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </header>

      {/* Navigation menu */}
      <nav className="nav">
        <div className="container">
          <div className="nav-container">
            <Link href="/" className="nav-link">
              Team Registration
            </Link>
            <Link href="/scoreboard" className="nav-link">
              Live Scoreboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="container">
        {children}
      </main>
    </div>
  );
}