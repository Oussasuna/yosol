
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume, VolumeX } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { VoiceRecorder } from '@/utils/VoiceRecorder';
import { 
  audioBufferToBlob, 
  blobToBase64, 
  transcribeAudio, 
  textToSpeech, 
  playAudioFromBase64,
  OPENAI_VOICES
} from '@/services/voiceAIService';

interface VoiceInterfaceProps {
  onCommand?: (command: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [isUsingAI, setIsUsingAI] = useState(true);
  
  const recorderRef = useRef<VoiceRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Check browser support
  useEffect(() => {
    // Check if browser supports getUserMedia for our AI voice implementation
    const checkAIVoiceSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setIsBrowserSupported(true);
        setIsUsingAI(true);
        return true;
      } catch (error) {
        console.log('AI voice recording not supported:', error);
        return false;
      }
    };

    // Check if browser supports SpeechRecognition as a fallback
    const checkSpeechRecognitionSupport = () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        return true;
      }
      return false;
    };

    const initVoiceSupport = async () => {
      const aiSupported = await checkAIVoiceSupport();
      
      if (!aiSupported) {
        const speechRecognitionSupported = checkSpeechRecognitionSupport();
        setIsUsingAI(false);
        setIsBrowserSupported(speechRecognitionSupported);
        
        if (!speechRecognitionSupported) {
          toast({
            title: "Voice Commands Limited",
            description: "Your browser doesn't support speech recognition. Using simulation mode.",
            variant: "default"
          });
        }
      }
    };

    initVoiceSupport();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Error stopping recognition:", e);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recorderRef.current) {
        if (recorderRef.current.isActive()) {
          recorderRef.current.stop();
        }
      }
    };
  }, []);

  const handleStartListening = () => {
    console.log('Starting listening process, using AI:', isUsingAI);
    setIsListening(true);
    setIsAnimating(true);
    setCommand('Listening...');
    setProcessingStatus('idle');
    
    if (isUsingAI) {
      // Use our AI voice implementation
      if (!recorderRef.current) {
        recorderRef.current = new VoiceRecorder();
      }
      
      recorderRef.current.start().catch(error => {
        console.error('Failed to start voice recorder:', error);
        setIsListening(false);
        setIsAnimating(false);
        setProcessingStatus('error');
        
        toast({
          title: "Microphone Access Error",
          description: "Could not access your microphone. Please check your permissions.",
          variant: "destructive"
        });
        
        // Fall back to simulation
        simulateVoiceRecognition();
      });
    } else if (recognitionRef.current && isBrowserSupported) {
      // Use browser's SpeechRecognition as fallback
      try {
        recognitionRef.current.start();
        console.log("Native speech recognition started");
      } catch (error) {
        console.error('Recognition start error:', error);
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
              console.log("Voice recognition restarted");
            }
          }, 100);
        } catch (stopError) {
          console.error('Could not restart recognition:', stopError);
          simulateVoiceRecognition();
        }
      }
    } else {
      // Fallback for browsers without any voice support
      simulateVoiceRecognition();
    }
  };

  const handleStopListening = async () => {
    console.log('Stopping listening process, using AI:', isUsingAI);
    
    if (isUsingAI && recorderRef.current) {
      try {
        setIsListening(false);
        setIsAnimating(false);
        setProcessingStatus('processing');
        
        // Get the recorded audio data
        const audioData = recorderRef.current.stop();
        
        // Convert audio data to blob and then to base64
        const audioBlob = audioBufferToBlob(audioData);
        const base64Audio = await blobToBase64(audioBlob);
        
        // Transcribe the audio using OpenAI
        console.log('Transcribing audio...');
        const transcribedText = await transcribeAudio(base64Audio);
        setCommand(transcribedText);
        
        // Process the command
        if (transcribedText && onCommand) {
          try {
            onCommand(transcribedText);
            setProcessingStatus('completed');
            
            // If not muted, provide voice response
            if (!isMuted) {
              respondWithVoice(transcribedText);
            }
          } catch (error) {
            console.error('Error processing command:', error);
            setProcessingStatus('error');
          }
        } else {
          setProcessingStatus('completed');
        }
      } catch (error) {
        console.error('Error in AI voice processing:', error);
        setProcessingStatus('error');
        toast({
          title: "Voice Processing Error",
          description: "Failed to process your voice command. Please try again.",
          variant: "destructive"
        });
      }
    } else if (recognitionRef.current && isBrowserSupported) {
      // Using browser's SpeechRecognition API
      try {
        recognitionRef.current.stop();
        console.log("Native speech recognition stopped");
      } catch (error) {
        console.error('Recognition stop error:', error);
      }
    } else {
      // For simulation mode
      setIsListening(false);
      setIsAnimating(false);
      if (command && command !== 'Listening...' && onCommand) {
        setProcessingStatus('processing');
        setTimeout(() => {
          try {
            onCommand(command);
            setProcessingStatus('completed');
          } catch (error) {
            console.error('Error processing command:', error);
            setProcessingStatus('error');
          }
        }, 500);
      }
    }
  };

  // Voice response using OpenAI's TTS
  const respondWithVoice = async (userCommand: string) => {
    try {
      // Generate an appropriate response based on the command
      let responseText;
      
      const lowerCommand = userCommand.toLowerCase();
      
      if (lowerCommand.includes('balance') || lowerCommand.includes('sol')) {
        responseText = "Your current balance is 243.75 SOL, equivalent to approximately 24,375 dollars.";
      } else if (lowerCommand.includes('stake') || lowerCommand.includes('staking')) {
        responseText = "I've prepared a transaction to stake SOL. Please confirm the details on screen.";
      } else if (lowerCommand.includes('send') || lowerCommand.includes('transfer')) {
        responseText = "I've prepared a transfer. Please review the recipient and amount on screen.";
      } else if (lowerCommand.includes('market') || lowerCommand.includes('price')) {
        responseText = "Solana is currently up 12.5% in the last 24 hours. The overall market sentiment is positive.";
      } else if (lowerCommand.includes('alert') || lowerCommand.includes('notification')) {
        responseText = "Price alert set. You'll be notified when SOL reaches your target price.";
      } else {
        responseText = "I've processed your command. Is there anything else you'd like to do with your wallet?";
      }
      
      // Convert text to speech
      console.log('Generating voice response...');
      const base64Audio = await textToSpeech(responseText, OPENAI_VOICES.NOVA);
      
      // Play the response
      await playAudioFromBase64(base64Audio);
      
    } catch (error) {
      console.error('Error generating voice response:', error);
    }
  };

  // Initialize speech recognition events
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setIsAnimating(true);
        setCommand('Listening...');
        setProcessingStatus('idle');
      };
      
      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result', event.results);
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setCommand(transcript);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setIsAnimating(false);
        
        if (command && command !== 'Listening...' && onCommand) {
          setProcessingStatus('processing');
          setTimeout(() => {
            try {
              onCommand(command);
              setProcessingStatus('completed');
              
              // If not muted, provide voice response
              if (!isMuted) {
                respondWithVoice(command);
              }
            } catch (error) {
              console.error('Error processing command:', error);
              setProcessingStatus('error');
            }
          }, 500);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setIsAnimating(false);
        setProcessingStatus('error');
        
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again or check microphone permissions.`,
          variant: "destructive"
        });
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice commands",
            variant: "destructive"
          });
        } else {
          // Fall back to simulation if there's an error
          simulateVoiceRecognition();
        }
      };
    }
  }, [command, onCommand, isMuted]);

  // Fallback for browsers without speech recognition
  const simulateVoiceRecognition = () => {
    console.log("Using simulated voice recognition");
    setIsListening(true);
    setIsAnimating(true);
    setCommand('Listening...');
    setProcessingStatus('idle');
    
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
        setProcessingStatus('processing');
        
        setTimeout(() => {
          if (onCommand) {
            try {
              onCommand(randomCommand);
              setProcessingStatus('completed');
              
              // If not muted, provide voice response
              if (!isMuted) {
                respondWithVoice(randomCommand);
              }
            } catch (error) {
              console.error('Error processing command:', error);
              setProcessingStatus('error');
            }
          }
        }, 1000);
      }, 1500);
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

  const triggerTestCommand = () => {
    const testCommands = [
      "Check my SOL balance",
      "Show me the latest market trends",
      "What are my staking rewards?",
      "Connect my wallet"
    ];
    
    const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
    setCommand(randomCommand);
    
    if (onCommand) {
      setProcessingStatus('processing');
      setTimeout(() => {
        try {
          onCommand(randomCommand);
          setProcessingStatus('completed');
          
          // If not muted, provide voice response
          if (!isMuted) {
            respondWithVoice(randomCommand);
          }
        } catch (error) {
          console.error('Error processing command:', error);
          setProcessingStatus('error');
        }
      }, 500);
    }
  };

  const getStatusIndicator = () => {
    if (processingStatus === 'idle') return null;
    
    return (
      <div className={`absolute top-0 right-0 m-1 p-1 rounded-full ${
        processingStatus === 'processing' ? 'bg-yellow-500' :
        processingStatus === 'completed' ? 'bg-green-500' :
        'bg-red-500'
      }`} style={{ width: '12px', height: '12px' }}></div>
    );
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium">Voice Assistant</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-white/10 px-2 py-1 rounded">
            {isUsingAI ? 'AI Voice' : 'Web Speech'}
          </span>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {isBrowserSupported 
            ? "Press and hold to speak a command" 
            : "Press and hold to simulate a voice command"}
        </p>
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
            {getStatusIndicator()}
          </button>
        </div>
      </div>
      
      {command && (
        <div className={`bg-white/5 p-4 rounded-lg animate-fade-in transition-opacity duration-300 ${
          command === 'Listening...' ? 'opacity-70' : 'opacity-100'
        }`}>
          <p className="text-sm text-muted-foreground mb-1">
            {command === 'Listening...' ? 'Listening...' : 'Recognized command:'}
          </p>
          <p className="text-white">{command === 'Listening...' ? '' : command}</p>
          {processingStatus === 'processing' && (
            <div className="mt-2 flex items-center">
              <div className="h-4 w-4 rounded-full border-2 border-solana border-t-transparent animate-spin mr-2"></div>
              <span className="text-xs text-muted-foreground">Processing command...</span>
            </div>
          )}
          {processingStatus === 'completed' && (
            <p className="text-xs text-green-400 mt-2">Command executed successfully</p>
          )}
          {processingStatus === 'error' && (
            <p className="text-xs text-red-400 mt-2">Error executing command</p>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground mb-2">Try: "Send SOL", "Check price", "Stake tokens", "Set alert"</p>
        {!isBrowserSupported && (
          <button 
            onClick={triggerTestCommand}
            className="text-xs text-solana hover:underline mt-2"
          >
            Try a test command
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;
