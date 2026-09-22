import React from 'react';
import { DailyUpdateModal, DailyUpdateModalProps } from './DailyUpdateModal';

// Re-export DailyUpdateModal for backward compatibility
export interface JarvisHUDModalProps extends DailyUpdateModalProps {
  autoGreetingEnabled?: boolean;
  onToggleAutoGreeting?: (val: boolean) => void;
  isSpeaking?: boolean;
  setIsSpeaking?: (val: boolean) => void;
  lastTranscript?: string;
  isListening?: boolean;
  isRecordingAudio?: boolean;
  isTapToSpeaking?: boolean;
  onToggleTapToSpeak?: () => void;
  onRequestMicPermission?: () => void;
  audioEngine?: string;
  micAudioLevel?: number;
}

export const JarvisHUDModal: React.FC<JarvisHUDModalProps> = (props) => {
  return <DailyUpdateModal {...props} />;
};

export const TinnyHUDModal = JarvisHUDModal;
