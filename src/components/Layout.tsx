
import React, { useEffect, useRef } from 'react';
import NavBar from './NavBar';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react'; // Import the Wallet icon from lucide-react
import * as THREE from 'three';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    
    // Add renderer to DOM
    container.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create sound wave particles
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
      
      // Color - use gradients between solana colors and wallet accent
      const ratio = Math.random();
      colors[i] = ratio * 0.2 + 0.1; // R - dark blue to teal
      colors[i + 1] = ratio * 0.5 + 0.2; // G - increase for teal
      colors[i + 2] = ratio * 0.7 + 0.3; // B - strong blue/purple
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Create wallet model - simple cube as placeholder
    const walletGeometry = new THREE.BoxGeometry(1.5, 1, 0.2);
    const walletMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x14f195, // Solana green
      emissive: 0x14f195,
      emissiveIntensity: 0.2,
      specular: 0xffffff,
      shininess: 30
    });
    const wallet = new THREE.Mesh(walletGeometry, walletMaterial);
    wallet.position.set(1.5, 0, 0);
    scene.add(wallet);
    
    // Create sound waves
    const waveCount = 5;
    const waves: THREE.Mesh[] = [];
    
    for (let i = 0; i < waveCount; i++) {
      const torusGeometry = new THREE.TorusGeometry(0.5 + i * 0.2, 0.02, 16, 100);
      const torusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x9945ff, // Solana purple
        transparent: true,
        opacity: 0.7 - (i * 0.1)
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.rotation.x = Math.PI / 2;
      torus.position.set(-1.5, 0, 0);
      scene.add(torus);
      waves.push(torus);
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Rotate particle system slowly
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.0005;
      
      // Animate wallet
      wallet.rotation.y += 0.01;
      
      // Animate sound waves
      waves.forEach((wave, index) => {
        wave.scale.x = 1 + 0.1 * Math.sin(Date.now() * 0.001 + index * 0.5);
        wave.scale.y = 1 + 0.1 * Math.sin(Date.now() * 0.001 + index * 0.5);
        wave.scale.z = 1 + 0.1 * Math.sin(Date.now() * 0.001 + index * 0.5);
      });
      
      renderer.render(sceneRef.current, cameraRef.current);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* 3D Background */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0"
        style={{ position: 'fixed' }}
      />
      
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 to-[#1a1a2e]/70 z-0"></div>
      
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* 3D grid effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <NavBar />
      
      <main className="relative z-10">
        {children}
      </main>
      
      <footer className="py-12 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Wallet className="h-6 w-6 text-solana" />
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">yosol</h3>
              </motion.div>
              <p className="text-sm text-muted-foreground">Your AI-Powered Voice Wallet for Solana</p>
              
              <div className="flex space-x-4 pt-2">
                {['Twitter', 'Discord', 'GitHub'].map((social, index) => (
                  <motion.a 
                    key={social}
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Features', 'Dashboard', 'Roadmap', 'Team'].map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'API', 'Support', 'Privacy'].map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Subscribe</h4>
              <p className="text-sm text-muted-foreground mb-3">Stay updated with the latest features and releases</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-white/5 text-sm border border-white/10 rounded-l-md focus:outline-none focus:ring-1 focus:ring-solana/50"
                />
                <button className="bg-solana hover:bg-solana-dark px-3 py-2 text-sm font-medium rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} yosol. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {['Terms', 'Privacy', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
