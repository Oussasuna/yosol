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
  const wavePointsRef = useRef<THREE.Points | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  
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
    
    // Create circular voice visualization
    const voiceGeometry = new THREE.BufferGeometry();
    const voicePositions = new Float32Array(2000 * 3);
    const voiceColors = new Float32Array(2000 * 3);
    
    // Create circular pattern
    const radius = 2;
    const segments = 100;
    const layers = 20;
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < layers; j++) {
        const index = (i * layers + j) * 3;
        const angle = (i / segments) * Math.PI * 2;
        const layerRadius = radius * (0.5 + j / layers * 0.5);
        
        voicePositions[index] = Math.cos(angle) * layerRadius;
        voicePositions[index + 1] = Math.sin(angle) * layerRadius;
        voicePositions[index + 2] = (j / layers - 0.5) * 2;
        
        // Color gradient from solana colors to wallet accent
        voiceColors[index] = 0.2 + j / layers * 0.5; // R - purplish to teal
        voiceColors[index + 1] = 0.1 + j / layers * 0.6; // G - increase for teal
        voiceColors[index + 2] = 0.6 - j / layers * 0.3; // B - decrease for teal
      }
    }
    
    voiceGeometry.setAttribute('position', new THREE.BufferAttribute(voicePositions, 3));
    voiceGeometry.setAttribute('color', new THREE.BufferAttribute(voiceColors, 3));
    
    const voiceMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    
    const voicePoints = new THREE.Points(voiceGeometry, voiceMaterial);
    scene.add(voicePoints);
    wavePointsRef.current = voicePoints;
    
    // Center voice visualization
    voicePoints.position.set(-0.5, 0, 0);
    
    // Create wallet object
    const walletGeometry = new THREE.BoxGeometry(1, 0.7, 0.15);
    const walletMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x14f195, // Solana green
      emissive: 0x14f195,
      emissiveIntensity: 0.3,
      specular: 0xffffff,
      shininess: 30
    });
    const wallet = new THREE.Mesh(walletGeometry, walletMaterial);
    wallet.position.set(1.5, 0, 0);
    scene.add(wallet);
    
    // Create sound wave connection between voice and wallet
    const connectionPoints = 8;
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = new Float32Array(connectionPoints * 3);
    const connectionColors = new Float32Array(connectionPoints * 3);
    
    for (let i = 0; i < connectionPoints; i++) {
      const index = i * 3;
      const t = i / (connectionPoints - 1);
      
      connectionPositions[index] = -0.5 + t * 2;
      connectionPositions[index + 1] = 0;
      connectionPositions[index + 2] = 0;
      
      // Gradient from voice to wallet
      connectionColors[index] = 0.6 - t * 0.4; // R - more in wallet
      connectionColors[index + 1] = 0.1 + t * 0.7; // G - more in wallet
      connectionColors[index + 2] = 0.6 - t * 0.3; // B - more in voice
    }
    
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
    connectionGeometry.setAttribute('color', new THREE.BufferAttribute(connectionColors, 3));
    
    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 3
    });
    
    const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
    scene.add(connectionLine);
    
    // Add particle background
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20 - 5; // Push back in z
      
      // Color - subtle background particles
      particleColors[i] = 0.1 + Math.random() * 0.1;
      particleColors[i + 1] = 0.1 + Math.random() * 0.1;
      particleColors[i + 2] = 0.2 + Math.random() * 0.2;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.5
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !wavePointsRef.current) return;
      
      // Simulate voice audio waves
      const positions = wavePointsRef.current.geometry.attributes.position.array as Float32Array;
      const segments = 100;
      const layers = 20;
      
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < layers; j++) {
          const index = (i * layers + j) * 3;
          const angle = (i / segments) * Math.PI * 2;
          
          // Base radius with wave effect
          const time = Date.now() * 0.001;
          const waveSpeed = 3;
          const waveHeight = 0.2;
          const baseRadius = 2 * (0.5 + j / layers * 0.5);
          
          // Create wave effect based on angle and time
          const wave1 = Math.sin(angle * 8 + time * waveSpeed) * waveHeight * (j / layers);
          const wave2 = Math.cos(angle * 6 + time * (waveSpeed * 0.8)) * waveHeight * (j / layers);
          const combinedWave = wave1 + wave2;
          
          const radius = baseRadius + combinedWave;
          
          positions[index] = Math.cos(angle) * radius;
          positions[index + 1] = Math.sin(angle) * radius;
          
          // Add subtle z-movement
          positions[index + 2] = (j / layers - 0.5) * 2 + Math.sin(time * 2 + j * 0.2) * 0.1;
        }
      }
      
      // Update the geometry
      wavePointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotate objects slightly
      wallet.rotation.y += 0.005;
      wallet.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Rotate particle system
      particleSystem.rotation.y += 0.0002;
      
      // Update connection line with wave effect
      const connectionPositions = connectionLine.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < connectionPoints; i++) {
        const index = i * 3;
        const t = i / (connectionPoints - 1);
        
        // Keep x position for smooth connection
        connectionPositions[index] = -0.5 + t * 2;
        
        // Add wave to y position
        const time = Date.now() * 0.002;
        const waveHeight = 0.15;
        const wave = Math.sin(t * 10 + time * 5) * waveHeight * Math.sin(t * Math.PI);
        connectionPositions[index + 1] = wave;
      }
      connectionLine.geometry.attributes.position.needsUpdate = true;
      
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
