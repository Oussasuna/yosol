
import React from 'react';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] text-white">
      <NavBar />
      <main className="container mx-auto px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-medium">yosol</h3>
              <p className="text-sm text-muted-foreground mt-1">Your AI-Powered Voice Wallet</p>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} yosol. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
