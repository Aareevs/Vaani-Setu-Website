export interface VoiceRecorderState {
  isRecording: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}

export class VoiceRecorder {
  private recognition: any = null;
  private isSupported = false;
  private onResultCallback: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.isSupported = true;
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.isSupported = true;
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (this.onResultCallback) {
          this.onResultCallback(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        if (this.onErrorCallback) {
          this.onErrorCallback(errorMessage);
        }
      };

      this.recognition.onend = () => {
        // Recognition ended
      };
    }
  }

  public startRecording(onResult: (transcript: string) => void, onError: (error: string) => void) {
    if (!this.isSupported) {
      onError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
    } catch (error) {
      onError('Failed to start speech recognition. Please try again.');
    }
  }

  public stopRecording() {
    if (this.recognition && this.isSupported) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  public getState(): VoiceRecorderState {
    return {
      isRecording: this.recognition && this.recognition.recognizing,
      isSupported: this.isSupported,
      transcript: '',
      error: null
    };
  }
}

export const voiceRecorder = new VoiceRecorder();