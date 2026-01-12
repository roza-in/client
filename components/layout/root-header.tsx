"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ThemeToggle, Avatar, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";

function getDashboardPath(role?: string) {
  switch (role) {
    case "admin":
      return "/admin";
    case "hospital":
      return "/hospital";
    case "doctor":
      return "/doctor";
    default:
      return "/patient";
  }
}

export function Header() { 
    const router = useRouter();
    const { user, isAuthenticated, isInitialized, logout } = useAuth();

    const handleLogout = async () => {
      await logout();
      router.push("/login");
    };

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

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {!isInitialized ? (
                <Button variant="ghost" disabled>
                  Loading...
                </Button>
              ) : isAuthenticated && user ? (
                <>
                  

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0">
                        <Avatar
                          className="h-9 w-9"
                          src={user.profilePictureUrl}
                          alt={user.fullName || "Profile"}
                          fallback={(user.fullName || user.email || "U").charAt(0).toUpperCase()}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2 text-sm">
                        <p className="font-medium text-foreground truncate">{user.fullName || "User"}</p>
                        <p className="text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(getDashboardPath(user.role))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/${user.role}/profile`)}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    )
 }