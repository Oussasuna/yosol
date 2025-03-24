
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume, VolumeX } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface VoiceInterfaceProps {
  onCommand?: (command: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsAnimating(true);
        setCommand('Listening...');
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setCommand(transcript);
      };
      
      recognitionRef.current.onend = () => {
        if (command && command !== 'Listening...' && onCommand) {
          onCommand(command);
        }
        setIsListening(false);
        setIsAnimating(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setIsAnimating(false);
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice commands",
            variant: "destructive"
          });
        }
      };
    } else {
      toast({
        title: "Voice Commands Unavailable",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Send final command when needed
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [command, onCommand]);

  const handleStartListening = () => {
    if (!recognitionRef.current) {
      // Fallback for browsers without speech recognition
      simulateVoiceRecognition();
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Recognition already started', error);
      recognitionRef.current.stop();
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      setIsListening(false);
      setIsAnimating(false);
      if (command && command !== 'Listening...' && onCommand) {
        onCommand(command);
      }
    }
  };

  // Fallback for browsers without speech recognition
  const simulateVoiceRecognition = () => {
    setIsListening(true);
    setIsAnimating(true);
    setCommand('Listening...');
    
    // Simulate delay for listening
    timeoutRef.current = window.setTimeout(() => {
      const exampleCommands = [
        'Send 5 SOL to wallet ending in 7X4F...',
        'Check current SOL price',
        'Stake 10 SOL for maximum yield',
        'Set price alert for SOL at $150',
      ];
      const randomCommand = exampleCommands[Math.floor(Math.random() * exampleCommands.length)];
      setCommand(randomCommand);
      
      // Simulate processing delay
      timeoutRef.current = window.setTimeout(() => {
        setIsListening(false);
        setIsAnimating(false);
        if (onCommand) {
          onCommand(randomCommand);
        }
      }, 1000);
    }, 1500);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Audio Enabled" : "Audio Muted",
      description: isMuted ? "Voice responses are now enabled" : "Voice responses are now muted",
      variant: "default"
    });
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium">Voice Assistant</h3>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="text-center mb-4">
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
            aria-label={isListening ? "Stop listening" : "Start listening"}
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
                isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />
              )}
            </div>
          </button>
        </div>
      </div>
      
      {command && (
        <div className={`bg-white/5 p-4 rounded-lg animate-fade-in transition-opacity duration-300 ${command === 'Listening...' ? 'opacity-70' : 'opacity-100'}`}>
          <p className="text-sm text-muted-foreground mb-1">
            {command === 'Listening...' ? 'Listening...' : 'Recognized command:'}
          </p>
          <p className="text-white">{command === 'Listening...' ? '' : command}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">Try: "Send SOL", "Check price", "Stake tokens", "Set alert"</p>
      </div>
    </div>
  );
};

export default VoiceInterface;
