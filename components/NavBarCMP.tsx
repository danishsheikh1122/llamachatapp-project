'use client'
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, Menu } from "lucide-react";

const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Button variant="ghost" size="sm" asChild>
    <Link href={href}>{children}</Link>
  </Button>
);

export default function NavBarCMP() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              AwesomeLogo
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavItem href="/">Home</NavItem>
              <NavItem href="/api">API</NavItem>
              <NavItem href="/about">About</NavItem>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" className="group">
              <Link href="/get-started" className="flex items-center gap-2">
                Get started
                <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem href="/">Home</NavItem>
            <NavItem href="/api">API</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/login">Login</NavItem>
            <NavItem href="/get-started">Get started</NavItem>
          </div>
        </div>
      )}
    </nav>
  );
}