import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume, VolumeX, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RecordAudio } from '@/utils/VoiceRecorder';
import { convertAudioToText, convertTextToAudio } from '@/services/voiceAIService';

// Define service status types
type ServiceStatus = 'online' | 'offline' | 'partial';

// Define constants for service status
const ONLINE_STATUS: ServiceStatus = 'online';
const OFFLINE_STATUS: ServiceStatus = 'offline';
const PARTIAL_STATUS: ServiceStatus = 'partial';

interface VoiceInterfaceProps {
  className?: string;
  onVoiceCommand?: (command: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  className,
  onVoiceCommand 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [sttStatus, setSTTStatus] = useState<ServiceStatus>(OFFLINE_STATUS);
  const [ttsStatus, setTTSStatus] = useState<ServiceStatus>(OFFLINE_STATUS);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef<RecordAudio | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsSpeaking(false);
    };
    
    // Check services status
    checkServicesStatus();
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stopRecording();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  const checkServicesStatus = async () => {
    try {
      // This would be a real API call in production
      // For now, simulate a check with a timeout
      setTimeout(() => {
        setSTTStatus(ONLINE_STATUS);
        setTTSStatus(ONLINE_STATUS);
      }, 1000);
    } catch (error) {
      console.error('Error checking services status:', error);
      setSTTStatus(OFFLINE_STATUS);
      setTTSStatus(OFFLINE_STATUS);
    }
  };
  
  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = async () => {
    try {
      if (sttStatus === OFFLINE_STATUS) {
        toast({
          title: "Service Unavailable",
          description: "Speech recognition service is currently offline.",
          variant: "destructive",
        });
        return;
      }
      
      setIsListening(true);
      setTranscript('');
      
      // Initialize recorder if not already done
      if (!recorderRef.current) {
        recorderRef.current = new RecordAudio();
      }
      
      // Start recording
      await recorderRef.current.startRecording();
      
      toast({
        title: "Listening...",
        description: "Speak now. I'm listening to your command.",
      });
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopListening = async () => {
    if (!recorderRef.current) return;
    
    try {
      setIsListening(false);
      
      // Stop recording and get audio blob
      const audioBlob = await recorderRef.current.stopRecording();
      
      // Process the audio
      processAudioInput(audioBlob);
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your voice command.",
        variant: "destructive",
      });
    }
  };
  
  const processAudioInput = async (audioBlob: Blob) => {
    try {
      // Convert audio to text
      const text = await convertAudioToText(audioBlob);
      
      if (!text || text.trim() === '') {
        toast({
          title: "No speech detected",
          description: "I couldn't hear anything. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setTranscript(text);
      
      // Process the command
      if (onVoiceCommand) {
        onVoiceCommand(text);
      }
      
      // Generate a response (this would be more sophisticated in a real app)
      const aiResponse = `I heard: "${text}". Processing your request...`;
      setResponse(aiResponse);
      
      // Convert response to speech
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your voice command.",
        variant: "destructive",
      });
    }
  };
  
  const speakResponse = async (text: string) => {
    if (ttsStatus === OFFLINE_STATUS) {
      toast({
        title: "Service Unavailable",
        description: "Text-to-speech service is currently offline.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSpeaking(true);
      
      // Convert text to audio
      const audioBlob = await convertTextToAudio(text);
      
      // Play the audio
      if (audioRef.current) {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error speaking response:', error);
      setIsSpeaking(false);
      toast({
        title: "Error",
        description: "Could not play the audio response.",
        variant: "destructive",
      });
    }
  };
  
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };
  
  const toggleStatus = () => {
    setShowStatus(!showStatus);
  };

  // Keep the existing status rendering function, but update the comparison
  const renderServiceStatus = () => {
    if (!showStatus) return null;

    const getStatusClass = (status: ServiceStatus) => {
      if (status === ONLINE_STATUS) return 'status-indicator-online';
      if (status === OFFLINE_STATUS) return 'status-indicator-offline';
      return 'status-indicator-partial';
    };

    return (
      <div className="flex flex-col space-y-1 mt-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className={cn('status-indicator', getStatusClass(sttStatus))}></div>
          <span>Speech-to-Text: {sttStatus}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={cn('status-indicator', getStatusClass(ttsStatus))}></div>
          <span>Text-to-Speech: {ttsStatus}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full transition-all duration-300",
            isListening ? "bg-red-500/20 text-red-500 border-red-500/50 animate-pulse" : ""
          )}
          onClick={toggleListening}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        {response && (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full transition-all duration-300",
              isSpeaking ? "bg-blue-500/20 text-blue-500 border-blue-500/50" : ""
            )}
            onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
          >
            {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleStatus}
        >
          <AlertTriangle className="h-4 w-4" />
        </Button>
      </div>
      
      {transcript && (
        <div className="mt-4 text-sm">
          <p className="font-medium">You said:</p>
          <p className="text-muted-foreground">{transcript}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-2 text-sm">
          <p className="font-medium">Response:</p>
          <p className="text-muted-foreground">{response}</p>
        </div>
      )}
      
      {renderServiceStatus()}
    </div>
  );
};

export default VoiceInterface;
