
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Upload, Link as LinkIcon, Play, Stop, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { RecordAudio } from '@/utils/VoiceRecorder';
import { transcribeAudio, transcribeAudioUrl } from '@/services/assemblyAIService';

const AssemblyAITranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [transcription, setTranscription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  
  const recorderRef = useRef<RecordAudio | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileRef = useRef<Blob | null>(null);
  
  // Start recording
  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscription('');
      
      // Initialize recorder if not already done
      if (!recorderRef.current) {
        recorderRef.current = new RecordAudio();
      }
      
      // Start recording
      await recorderRef.current.startRecording();
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  // Stop recording and process audio
  const stopRecording = async () => {
    if (!recorderRef.current) return;
    
    try {
      setIsRecording(false);
      
      // Stop recording and get audio blob
      const audioBlob = await recorderRef.current.stopRecording();
      audioFileRef.current = audioBlob;
      
      toast({
        title: "Recording Stopped",
        description: "Recording saved. Click 'Transcribe' to process.",
      });
      
      setFileInfo('Recording ready for transcription');
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your recording.",
        variant: "destructive",
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an audio file.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the file
    audioFileRef.current = file;
    setFileInfo(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    toast({
      title: "File Uploaded",
      description: "Audio file ready for transcription.",
    });
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Transcribe audio file
  const transcribeFile = async () => {
    if (!audioFileRef.current) {
      toast({
        title: "No Audio",
        description: "Please record or upload an audio file first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTranscribing(true);
    setProgressStatus('Starting transcription...');
    
    try {
      const text = await transcribeAudio(audioFileRef.current, setProgressStatus);
      
      if (text) {
        setTranscription(text);
        toast({
          title: "Transcription Complete",
          description: "Your audio has been transcribed.",
        });
      } else {
        toast({
          title: "Transcription Empty",
          description: "No speech was detected in the audio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Failed",
        description: error.message || "Failed to transcribe audio.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
      setProgressStatus('');
    }
  };
  
  // Transcribe from URL
  const transcribeFromUrl = async () => {
    if (!audioUrl) {
      toast({
        title: "No URL",
        description: "Please enter an audio URL.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTranscribing(true);
    setProgressStatus('Starting transcription from URL...');
    
    try {
      const text = await transcribeAudioUrl(audioUrl, setProgressStatus);
      
      if (text) {
        setTranscription(text);
        toast({
          title: "Transcription Complete",
          description: "Your audio has been transcribed.",
        });
      } else {
        toast({
          title: "Transcription Empty",
          description: "No speech was detected in the audio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Failed",
        description: error.message || "Failed to transcribe audio URL.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
      setProgressStatus('');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assembly AI Transcription</CardTitle>
        <CardDescription>
          Transcribe audio to text using advanced AI technology
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="record">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-muted/5">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="h-16 w-16 rounded-full"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
              >
                {isRecording ? <Stop className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </p>
              {fileInfo && <p className="mt-2 text-xs text-green-500">{fileInfo}</p>}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-muted/5">
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="lg"
                className="h-16 w-full border-dashed"
                onClick={triggerFileUpload}
                disabled={isTranscribing}
              >
                <Upload className="h-6 w-6 mr-2" />
                Upload Audio File
              </Button>
              {fileInfo && <p className="mt-4 text-xs text-green-500">{fileInfo}</p>}
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter audio file URL (MP3, WAV, etc.)"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  disabled={isTranscribing}
                />
              </div>
              <Button
                onClick={transcribeFromUrl}
                disabled={!audioUrl || isTranscribing}
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Transcribe URL
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {progressStatus && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-md text-sm">
            <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin text-blue-500" />
            <span>{progressStatus}</span>
          </div>
        )}
        
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-medium">Transcription Result</h3>
          <Textarea
            value={transcription}
            placeholder="Transcription will appear here..."
            className="min-h-[200px]"
            readOnly
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setTranscription('')}
          disabled={!transcription || isTranscribing}
        >
          Clear
        </Button>
        
        <Button
          onClick={transcribeFile}
          disabled={(!audioFileRef.current && !audioUrl) || isTranscribing || isRecording}
        >
          {isTranscribing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Transcribe
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssemblyAITranscriber;
