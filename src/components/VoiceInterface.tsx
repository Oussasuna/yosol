
import React, { useState } from 'react';

interface VoiceInterfaceProps {
  onCommand?: (command: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartListening = () => {
    setIsListening(true);
    setIsAnimating(true);
    // Simulating voice recognition start
    setTimeout(() => {
      // Randomize example commands to showcase different features
      const exampleCommands = [
        'Send 5 SOL to wallet ending in 7X4F...',
        'Check current SOL price',
        'Stake 10 SOL for maximum yield',
        'Set price alert for SOL at $150',
      ];
      const randomCommand = exampleCommands[Math.floor(Math.random() * exampleCommands.length)];
      setCommand(randomCommand);
      // In a real implementation, we would connect to the device's microphone
    }, 1500);
  };

  const handleStopListening = () => {
    setIsListening(false);
    setIsAnimating(false);
    if (command && onCommand) {
      onCommand(command);
    }
  };

  const handleRippleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple-effect');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium mb-2">Voice Assistant</h3>
        <p className="text-sm text-muted-foreground">Press and hold to speak a command</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative">
          <button
            className={`ripple-container w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-r from-solana to-wallet-accent shadow-lg shadow-solana/20' 
                : 'bg-white/10 hover:bg-white/15'
            }`}
            onMouseDown={handleStartListening}
            onMouseUp={handleStopListening}
            onTouchStart={handleStartListening}
            onTouchEnd={handleStopListening}
            onClick={handleRippleEffect}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {isAnimating && (
                <div className="absolute inset-0 bg-white/10 animate-pulse-light"></div>
              )}
            </div>
            
            <div className="relative z-10 flex space-x-[2px]">
              {isAnimating ? (
                <>
                  <div className="voice-wave voice-wave-1"></div>
                  <div className="voice-wave voice-wave-2"></div>
                  <div className="voice-wave voice-wave-3"></div>
                  <div className="voice-wave voice-wave-4"></div>
                  <div className="voice-wave voice-wave-5"></div>
                </>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.34998 9.65002V11.35C4.34998 15.57 7.77998 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.65002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
      
      {command && (
        <div className="bg-white/5 p-4 rounded-lg animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">Recognized command:</p>
          <p className="text-white">{command}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">Try: "Send SOL", "Check price", "Stake tokens", "Set alert"</p>
      </div>
    </div>
  );
};

export default VoiceInterface;
