
import React from 'react';
import { Home, User, Briefcase, FileText, Wallet, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NavBar as TubelightNavBar } from "@/components/ui/tubelight-navbar";

const NavBar = () => {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Features', url: '#features', icon: Briefcase },
    { name: 'Roadmap', url: '#roadmap', icon: FileText },
    { name: 'Docs', url: '#docs', icon: BookOpen },
    { name: 'Dashboard', url: '/dashboard', icon: User }
  ];

  return (
    <>
      <header className="absolute top-0 right-0 p-4 z-50 flex items-center justify-end">
        <Button 
          className="bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white shadow-lg shadow-solana/20 hover:shadow-solana/30 transition-all duration-300"
          size="sm"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </header>
      <TubelightNavBar items={navItems} />
    </>
  );
};

export default NavBar;
