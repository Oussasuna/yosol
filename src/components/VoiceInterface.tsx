import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume, VolumeX, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { VoiceRecorder } from '@/utils/VoiceRecorder';
import { supabase } from '@/integrations/supabase/client';
import { 
  audioBufferToBlob, 
  blobToBase64, 
  transcribeAudio, 
  textToSpeech, 
  playAudioFromBase64,
  OPENAI_VOICES,
  type ServiceStatus
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
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>('online');
  const [errorCount, setErrorCount] = useState(0);
  
  const recorderRef = useRef<VoiceRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const resetTimer = setInterval(() => {
      if (errorCount > 0) {
        setErrorCount(0);
        if (serviceStatus !== 'online') {
          setServiceStatus('online');
          console.log('Voice service status reset to online, retrying AI services');
        }
      }
    }, 60000);

    return () => clearInterval(resetTimer);
  }, [errorCount, serviceStatus]);

  useEffect(() => {
    const checkAIVoiceSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setIsBrowserSupported(true);
        setIsUsingAI(true);
        console.log("AI voice recording is supported");
        return true;
      } catch (error) {
        console.log('AI voice recording not supported:', error);
        return false;
      }
    };

    const checkSpeechRecognitionSupport = () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        console.log("Browser SpeechRecognition is supported");
        return true;
      }
      console.log("Browser SpeechRecognition is NOT supported");
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

    const testVoiceServices = async () => {
      try {
        const testResponse = await supabase.functions.invoke('voice-to-text', {
          body: { test: true }
        });
        
        if (testResponse.error) {
          if (testResponse.error.message && (
            testResponse.error.message.includes('quota') || 
            testResponse.error.message.includes('exceeded')
          )) {
            console.log('Voice service quota exceeded, enabling simulation mode');
            setServiceStatus('offline');
            setIsUsingAI(false);
          }
        }
      } catch (error) {
        console.warn('Voice service test failed:', error);
      }
    };
    
    setTimeout(() => {
      testVoiceServices();
    }, 2000);

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
    console.log('Starting listening process, using AI:', isUsingAI, 'service status:', serviceStatus);
    setIsListening(true);
    setIsAnimating(true);
    setCommand('Listening...');
    setProcessingStatus('idle');
    
    if (serviceStatus === 'offline' || errorCount >= 3) {
      console.log('Voice service is offline or too many errors, using simulation mode');
      simulateVoiceRecognition();
      return;
    }
    
    if (isUsingAI) {
      if (!recorderRef.current) {
        recorderRef.current = new VoiceRecorder();
      }
      
      recorderRef.current.start().catch(error => {
        console.error('Failed to start voice recorder:', error);
        setIsListening(false);
        setIsAnimating(false);
        setProcessingStatus('error');
        setErrorCount(count => count + 1);
        
        toast({
          title: "Microphone Access Error",
          description: "Could not access your microphone. Please check your permissions.",
          variant: "destructive"
        });
        
        simulateVoiceRecognition();
      });
    } else if (recognitionRef.current && isBrowserSupported) {
      try {
        recognitionRef.current.start();
        console.log("Native speech recognition started");
      } catch (error) {
        console.error('Recognition start error:', error);
        setErrorCount(count => count + 1);
        
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
      simulateVoiceRecognition();
    }
  };

  const handleStopListening = async () => {
    console.log('Stopping listening process, using AI:', isUsingAI, 'service status:', serviceStatus);
    
    if (isUsingAI && recorderRef.current && serviceStatus === 'online') {
      try {
        setIsListening(false);
        setIsAnimating(false);
        setProcessingStatus('processing');
        
        const audioData = recorderRef.current.stop();
        
        if (!audioData || audioData.length === 0) {
          console.error('No audio data captured');
          throw new Error('No audio data captured');
        }
        
        const audioBlob = audioBufferToBlob(audioData);
        const base64Audio = await blobToBase64(audioBlob);
        
        console.log('Transcribing audio with high-accuracy settings...');
        const transcribedText = await transcribeAudio(base64Audio);
        
        if (!transcribedText) {
          console.error('No transcription returned');
          throw new Error('Failed to transcribe audio');
        }
        
        setCommand(transcribedText);
        
        if (transcribedText && onCommand) {
          try {
            onCommand(transcribedText);
            setProcessingStatus('completed');
            
            if (!isMuted && serviceStatus !== 'offline') {
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
        setErrorCount(count => count + 1);
        
        if (errorCount >= 2) {
          setServiceStatus('offline');
          setIsUsingAI(false);
          toast({
            title: "Voice Service Offline",
            description: "Voice processing service is unavailable. Using simulation mode.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Voice Processing Error",
            description: "Failed to process your voice command. Please try again.",
            variant: "destructive"
          });
        }
        
        simulateVoiceRecognition();
      }
    } else if (recognitionRef.current && isBrowserSupported && serviceStatus !== 'offline') {
      try {
        recognitionRef.current.stop();
        console.log("Native speech recognition stopped");
      } catch (error) {
        console.error('Recognition stop error:', error);
        setErrorCount(count => count + 1);
      }
    } else {
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

  const respondWithVoice = async (userCommand: string) => {
    if (serviceStatus === 'offline') {
      console.log('Voice service is offline, skipping voice response');
      return;
    }
  
    try {
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
      
      console.log('Generating voice response...');
      const base64Audio = await textToSpeech(responseText, OPENAI_VOICES.NOVA);
      
      if (!base64Audio) {
        toast({
          title: "Voice Assistant",
          description: responseText,
          duration: 5000,
        });
        return;
      }
      
      await playAudioFromBase64(base64Audio);
      
    } catch (error) {
      console.error('Error generating voice response:', error);
      setErrorCount(count => count + 1);
      
      if (errorCount >= 2) {
        setServiceStatus('offline');
      }
    }
  };

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
          .join(' ');
        
        console.log('Raw transcript:', transcript);
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
              
              if (!isMuted && serviceStatus !== 'offline') {
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
        setErrorCount(count => count + 1);
        
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
          simulateVoiceRecognition();
        }
      };
    }
  }, [command, onCommand, isMuted, serviceStatus, errorCount]);

  const simulateVoiceRecognition = () => {
    console.log("Using simulated voice recognition");
    setIsListening(true);
    setIsAnimating(true);
    setCommand('Listening...');
    setProcessingStatus('idle');
    
    timeoutRef.current = window.setTimeout(() => {
      const exampleCommands = [
        'Show me my SOL balance',
        'Check the current Solana price',
        'Stake 10 SOL for maximum yield',
        'Send 5 SOL to wallet ending in 7X4F',
        'Show me my recent transactions',
        'What NFTs do I own?',
        'Set a price alert for SOL at $150'
      ];
      const randomCommand = exampleCommands[Math.floor(Math.random() * exampleCommands.length)];
      setCommand(randomCommand);
      
      timeoutRef.current = window.setTimeout(() => {
        setIsListening(false);
        setIsAnimating(false);
        setProcessingStatus('processing');
        
        setTimeout(() => {
          if (onCommand) {
            try {
              onCommand(randomCommand);
              setProcessingStatus('completed');
              
              if (!isMuted && serviceStatus !== 'offline') {
                respondWithVoice(randomCommand);
              } else {
                let responseText = "";
                
                if (randomCommand.includes('balance') || randomCommand.includes('SOL')) {
                  responseText = "Your current balance is 243.75 SOL (approximately $24,375)";
                } else if (randomCommand.includes('stake')) {
                  responseText = "Prepared a staking transaction of 10 SOL";
                } else if (randomCommand.includes('send')) {
                  responseText = "Prepared to send 5 SOL to specified wallet";
                } else if (randomCommand.includes('price')) {
                  responseText = "SOL is currently at $100, up 12.5% in 24 hours";
                } else {
                  responseText = "Command processed successfully";
                }
                
                toast({
                  title: "Voice Assistant",
                  description: responseText,
                  duration: 5000,
                });
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

  const enableSimulationMode = () => {
    setServiceStatus('offline');
    setIsUsingAI(false);
    
    toast({
      title: "Simulation Mode Enabled",
      description: "Voice assistant is now using simulation mode for demo purposes.",
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
          
          if (!isMuted && serviceStatus !== 'offline') {
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
          <span className={`text-xs text-muted-foreground px-2 py-1 rounded ${
            serviceStatus === 'offline' 
              ? 'bg-red-500/20 text-red-300' 
              : serviceStatus === 'partial' 
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-white/10'
          }`}>
            {serviceStatus === 'offline' 
              ? 'Simulation Mode' 
              : isUsingAI 
                ? 'AI Voice' 
                : 'Web Speech'}
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
      
      {serviceStatus === 'offline' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-red-300">Voice Service Unavailable</p>
            <p className="text-red-300/70">Using simulation mode. Your commands will be simulated.</p>
          </div>
        </div>
      )}
      
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {serviceStatus === 'offline'
            ? "Press and hold to simulate a voice command"
            : isBrowserSupported 
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
        <p className="text-xs text-muted-foreground mb-2">Try: "Show my balance", "Check price", "Stake tokens", "Send SOL"</p>
        <div className="flex justify-center gap-2 mt-2">
          {!isBrowserSupported && (
            <button 
              onClick={triggerTestCommand}
              className="text-xs text-solana hover:underline"
            >
              Try a test command
            </button>
          )}
          {serviceStatus !== 'offline' && (
            <button 
              onClick={enableSimulationMode}
              className="text-xs text-muted-foreground hover:underline"
            >
              Switch to simulation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
