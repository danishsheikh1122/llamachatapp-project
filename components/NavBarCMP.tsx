"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, Menu, X, LogIn } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/images/llama50.png";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "./ui/darkmode-toggel";
const NavItem = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Button
    variant="link"
    size="sm"
    asChild
    className="w-full md:w-auto h-10 text-md font-thin font-mono text-foreground hover:text-primary transition-colors"
    onClick={onClick}
  >
    <Link href={href}>{children}</Link>
  </Button>
);

export const NavBarCMP = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background transition-all duration-300 ${
        isScrolled ? "shadow-md dark:shadow-md dark:border-b-2" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary flex items-center gap-2"
            >
              <Image src={Logo} width={25} height={25} alt="Llama logo"></Image>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                FUTURiSTiC-Llama
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <NavItem href="/">Home</NavItem>
            <NavItem href="/api">API</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="">
              <ModeToggle></ModeToggle>
            </NavItem>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center justify-center gap-2 font-mono">
                <UserButton></UserButton>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  {user.username}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="font-mono">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="group font-mono">
                    <span className="flex items-center gap-2">
                      Get started
                      <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 supports-[backdrop-filter]:bg-background/95 shadow-md z-1">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavItem href="/" onClick={toggleMenu}>
              Home
            </NavItem>
            <NavItem href="/api" onClick={toggleMenu}>
              API
            </NavItem>
            <NavItem href="/about" onClick={toggleMenu}>
              About
            </NavItem>
            <NavItem href="" onClick={toggleMenu}>
              <ModeToggle></ModeToggle>
            </NavItem>

            {user ? (
              <div className="flex items-center justify-center gap-2 font-mono">
                <UserButton></UserButton>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  {user.username}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleMenu();
                    }}
                    className="w-full justify-start font-mono text-left h-12 flex items-center gap-2"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    onClick={() => {
                      toggleMenu();
                    }}
                    className="w-full justify-start font-mono text-left h-12 group flex items-center gap-2"
                  >
                    <span className="flex items-center gap-2">
                      Get started
                      <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
