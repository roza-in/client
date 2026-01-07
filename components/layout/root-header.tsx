import { Button, ThemeToggle } from "@/components/ui";
import Link from "next/link";

export function Header() { 
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">R</span>
              </div>
              <span className="font-semibold text-xl text-foreground">ROZX</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/hospitals" className="text-muted-foreground hover:text-foreground transition-colors">
                Find Hospitals
              </Link>
              <Link href="/doctors" className="text-muted-foreground hover:text-foreground transition-colors">
                Find Doctors
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
 }