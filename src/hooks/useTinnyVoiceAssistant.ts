import { useState, useEffect, useRef, useCallback } from 'react';
import { playChuckWakeChime, speakSweetChuckVoice, cancelSpeech } from '../utils/audioUtils';
import { SmartwatchData } from '../types';

interface UseChuckVoiceAssistantOptions {
  patientName?: string;
  glucoseSpikeMgDl: number;
  bpReading: string;
  watchData: SmartwatchData;
  criticalRestockNames: string[];
  nextAppointment: string;
  phq9Score: number;
  medications?: string[];
  autoListenOnMount?: boolean;
}

export function useChuckVoiceAssistant({
  patientName = 'Kanika',
  glucoseSpikeMgDl,
  bpReading,
  watchData,
  criticalRestockNames,
  nextAppointment,
  phq9Score,
  medications = [
    'Duloxetine 60mg (Morning)',
    'Metformin ER 1000mg (Morning & Dinner)',
    'Empagliflozin 10mg (Morning)',
    'Atorvastatin 20mg (Bedtime)',
  ],
  autoListenOnMount = true,
}: UseChuckVoiceAssistantOptions) {
  // Mic should be unmuted by default at all times
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chuck_mic_muted');
      return saved !== null ? JSON.parse(saved) : false; // Default: unmuted
    } catch {
      return false;
    }
  });

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [isTapToSpeaking, setIsTapToSpeaking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [matchedWakePhrase, setMatchedWakePhrase] = useState<string | null>(null);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState<boolean>(true);
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [activeSpeechScript, setActiveSpeechScript] = useState<string>('');
  const [isCompilingScript, setIsCompilingScript] = useState<boolean>(false);
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [audioEngine, setAudioEngine] = useState<'hybrid' | 'gemini-multimodal' | 'web-speech' | 'idle'>('hybrid');
  const [micDeviceLabel, setMicDeviceLabel] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef<boolean>(isMuted);
  const isSpeakingRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const isRecordingAudioRef = useRef<boolean>(false);
  const isTapToSpeakingRef = useRef<boolean>(false);
  const isTriggeringRef = useRef<boolean>(false);

  const restartTimeoutRef = useRef<any>(null);
  const debounceProcessTimeoutRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatedSpeechRef = useRef<string>('');
  const lastWebSpeechProcessedTimeRef = useRef<number>(0);

  isMutedRef.current = isMuted;
  isSpeakingRef.current = isSpeaking;
  isListeningRef.current = isListening;
  isRecordingAudioRef.current = isRecordingAudio;
  isTapToSpeakingRef.current = isTapToSpeaking;

  // Persist mute choice
  useEffect(() => {
    try {
      localStorage.setItem('chuck_mic_muted', JSON.stringify(isMuted));
    } catch {
      // ignore
    }
  }, [isMuted]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  // Compile local sweet Chuck briefing fallback
  const compileLocalBriefing = useCallback(() => {
    const timeGreeting = getTimeGreeting();
    const parts: string[] = [
      `${timeGreeting}, ${patientName} dear. Chuck here with your sweet medical update.`,
    ];

    if (glucoseSpikeMgDl > 180) {
      parts.push(
        `Your glucose monitor detected a spike to ${glucoseSpikeMgDl} milligrams per deciliter, with blood pressure at ${bpReading}. Please sip fresh water gently and rest, sweetheart.`
      );
    }

    if (watchData.steps < 3000 || watchData.sedentaryAlert) {
      parts.push(
        `You have logged ${watchData.steps} steps so far. A cozy walk will help your circulation and gently lower your sugar.`
      );
    } else {
      parts.push(`Your smartwatch activity is looking lovely at ${watchData.steps} steps.`);
    }

    if (criticalRestockNames.length > 0) {
      parts.push(
        `Also sweetheart, your pharmacy restock is urgent for ${criticalRestockNames.join(
          ' and '
        )}. Let's refill those today.`
      );
    }

    if (nextAppointment) {
      parts.push(`Your next appointment is scheduled for ${nextAppointment}.`);
    }

    parts.push(
      `I'm right here with you, ${patientName}. Dr. Jenkins' emergency line is on standby if you need anything at all.`
    );

    return parts.join(' ');
  }, [patientName, glucoseSpikeMgDl, bpReading, watchData, criticalRestockNames, nextAppointment]);

  const startRecognitionSafely = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isMutedRef.current || isSpeakingRef.current) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      if (e?.name === 'InvalidStateError') {
        setIsListening(true);
      }
    }
  }, []);

  // Main voice interaction: Chuck answers ANY question or gives daily update
  const askChuckQuestion = useCallback(
    async (rawQuestion: string) => {
      if (isTriggeringRef.current || isSpeakingRef.current) return;
      isTriggeringRef.current = true;
      lastWebSpeechProcessedTimeRef.current = Date.now();

      const cleanQuestion = rawQuestion.trim();
      setMatchedWakePhrase(`Heard: "${cleanQuestion}"`);
      setLiveTranscript('');
      accumulatedSpeechRef.current = '';

      // 1. Play Chuck's gentle crystal wake chime
      playChuckWakeChime();
      cancelSpeech();

      setIsCompilingScript(true);
      let responseScript = '';

      const lower = cleanQuestion.toLowerCase();

      // Check for immediate quick intent: "Can you hear me?" / "Are you listening?"
      if (
        lower.includes('can you hear me') ||
        lower.includes('are you listening') ||
        lower.includes('are you there') ||
        lower.includes('hear me') ||
        lower.includes('mic test') ||
        lower.includes('test test') ||
        lower === 'hello' ||
        lower === 'hi' ||
        lower === 'hey' ||
        lower === 'chuck' ||
        lower === 'hey chuck' ||
        lower === 'hello chuck'
      ) {
        responseScript = `Yes ${patientName} darling, I can hear you loud and clear! Chuck is right here with you. How can I take care of you today?`;
      } else {
        const isDailyUpdateQuery =
          lower.includes('update') ||
          lower.includes('briefing') ||
          lower.includes("today's update") ||
          lower.includes('todays update') ||
          lower.includes('today update') ||
          lower.includes('daily report');

        try {
          if (isDailyUpdateQuery) {
            const res = await fetch('/api/generate-chuck-briefing', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                patientName,
                currentHour: new Date().getHours(),
                glucoseMgDl: glucoseSpikeMgDl,
                bpSystolic: parseInt(bpReading.split('/')[0]) || 138,
                bpDiastolic: parseInt(bpReading.split('/')[1]) || 88,
                steps: watchData.steps,
                stepGoal: watchData.stepGoal,
                restockWarnings: criticalRestockNames,
                missedAppointments: [nextAppointment],
                phq9Score,
                assistantName: 'Chuck',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.speechScript) {
                responseScript = data.speechScript;
              }
            }
          } else {
            // General Question to Chuck
            const res = await fetch('/api/ask-chuck', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                question: cleanQuestion,
                patientName,
                assistantName: 'Chuck',
                glucoseMgDl: glucoseSpikeMgDl,
                bpReading,
                steps: watchData.steps,
                stepGoal: watchData.stepGoal,
                restockWarnings: criticalRestockNames,
                nextAppointment,
                medications,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.speechScript) {
                responseScript = data.speechScript;
              }
            }
          }
        } catch (err) {
          console.warn('Backend API request failed, using sweet local fallback:', err);
        } finally {
          setIsCompilingScript(false);
        }
      }

      if (!responseScript) {
        if (
          lower.includes('update') ||
          lower.includes('briefing') ||
          lower.includes('routine')
        ) {
          responseScript = compileLocalBriefing();
        } else if (lower.includes('sugar') || lower.includes('glucose')) {
          responseScript = `Your glucose is currently ${glucoseSpikeMgDl} milligrams per deciliter, ${patientName} dear. Please drink warm water, rest, and avoid sweet carbs right now.`;
        } else if (lower.includes('medicine') || lower.includes('pill')) {
          responseScript = `Your medicines for today are Metformin ER and Duloxetine, ${patientName}. Remember that your Duloxetine restock is urgent, so let's refill it today.`;
        } else if (lower.includes('food') || lower.includes('eat') || lower.includes('diet')) {
          responseScript = `For your meals today, ${patientName}, high-fiber lentils, fresh vegetables, and omega-3 proteins will gently support your blood sugar and mood.`;
        } else {
          responseScript = `Hello ${patientName} dear. Chuck is listening and taking care of you. Your blood sugar is currently ${glucoseSpikeMgDl} milligrams per deciliter, and your routine is safely monitored. What else can I do for you sweetheart?`;
        }
      }

      setActiveSpeechScript(responseScript);

      // Stop recognition while speaking so Chuck doesn't hear herself
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }

      speakSweetChuckVoice(responseScript, {
        onStart: () => {
          setIsSpeaking(true);
        },
        onEnd: () => {
          setIsSpeaking(false);
          isTriggeringRef.current = false;
          if (!isMutedRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
              startRecognitionSafely();
            }, 250);
          }
        },
        onError: () => {
          setIsSpeaking(false);
          isTriggeringRef.current = false;
          if (!isMutedRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
              startRecognitionSafely();
            }, 250);
          }
        },
      });
    },
    [
      compileLocalBriefing,
      patientName,
      glucoseSpikeMgDl,
      bpReading,
      watchData,
      criticalRestockNames,
      nextAppointment,
      phq9Score,
      medications,
      startRecognitionSafely,
    ]
  );

  // Send raw audio recording directly to Gemini Multimodal Audio
  const askChuckWithAudioBlob = useCallback(
    async (blob: Blob) => {
      if (isTriggeringRef.current || isSpeakingRef.current) return;
      isTriggeringRef.current = true;

      // Check if Web Speech API recently handled this speech
      if (Date.now() - lastWebSpeechProcessedTimeRef.current < 1200) {
        isTriggeringRef.current = false;
        return;
      }

      playChuckWakeChime();
      cancelSpeech();
      setIsCompilingScript(true);
      setLiveTranscript('Chuck is listening to your voice recording...');

      try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const res = await fetch('/api/ask-chuck-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: blob.type || 'audio/webm',
                patientName,
                assistantName: 'Chuck',
                glucoseMgDl: glucoseSpikeMgDl,
                bpReading,
                steps: watchData.steps,
                stepGoal: watchData.stepGoal,
                restockWarnings: criticalRestockNames,
                nextAppointment,
                medications,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.transcribedText) {
                setLastTranscript(data.transcribedText);
                setMatchedWakePhrase(`Heard via Gemini Voice: "${data.transcribedText}"`);
              }
              const scriptToSpeak =
                data.speechScript ||
                `Yes ${patientName} dear, Chuck heard you! How can I take care of you sweetheart?`;

              setActiveSpeechScript(scriptToSpeak);
              setAudioEngine('gemini-multimodal');

              speakSweetChuckVoice(scriptToSpeak, {
                onStart: () => {
                  setIsSpeaking(true);
                },
                onEnd: () => {
                  setIsSpeaking(false);
                  isTriggeringRef.current = false;
                  if (!isMutedRef.current) {
                    clearTimeout(restartTimeoutRef.current);
                    restartTimeoutRef.current = setTimeout(() => {
                      startRecognitionSafely();
                    }, 250);
                  }
                },
                onError: () => {
                  setIsSpeaking(false);
                  isTriggeringRef.current = false;
                  if (!isMutedRef.current) {
                    clearTimeout(restartTimeoutRef.current);
                    restartTimeoutRef.current = setTimeout(() => {
                      startRecognitionSafely();
                    }, 250);
                  }
                },
              });
            } else {
              // fallback
              askChuckQuestion('Can you hear me?');
            }
          } catch (e) {
            console.warn('Direct audio API failed:', e);
            askChuckQuestion('Can you hear me?');
          } finally {
            setIsCompilingScript(false);
            setLiveTranscript('');
          }
        };
      } catch (err) {
        console.warn('Error reading audio blob:', err);
        isTriggeringRef.current = false;
        setIsCompilingScript(false);
      }
    },
    [
      askChuckQuestion,
      bpReading,
      criticalRestockNames,
      glucoseSpikeMgDl,
      medications,
      nextAppointment,
      patientName,
      startRecognitionSafely,
      watchData.stepGoal,
      watchData.steps,
    ]
  );

  // Stop recording speech audio
  const stopAudioRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      setIsRecordingAudio(false);
      setIsTapToSpeaking(false);
      return;
    }

    try {
      mediaRecorderRef.current.stop();
    } catch {
      // ignore
    }
    setIsRecordingAudio(false);
    setIsTapToSpeaking(false);
  }, []);

  // Start recording speech audio
  const startAudioRecording = useCallback(() => {
    if (isSpeakingRef.current || isTriggeringRef.current) return;
    if (!mediaStreamRef.current) return;

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        return;
      }

      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/wav',
      ];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = selectedMime
        ? new MediaRecorder(mediaStreamRef.current, { mimeType: selectedMime })
        : new MediaRecorder(mediaStreamRef.current);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const duration = Date.now() - recordingStartTimeRef.current;
        if (audioChunksRef.current.length > 0 && duration >= 500) {
          const blob = new Blob(audioChunksRef.current, {
            type: selectedMime || 'audio/webm',
          });
          audioChunksRef.current = [];
          askChuckWithAudioBlob(blob);
        }
      };

      recorder.start(200);
      mediaRecorderRef.current = recorder;
      setIsRecordingAudio(true);
    } catch (e) {
      console.warn('Could not start MediaRecorder:', e);
    }
  }, [askChuckWithAudioBlob]);

  // Request Microphone Access (guaranteed user-gesture handler)
  const requestMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicPermissionState('denied');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      setMicPermissionState('granted');
      setIsMuted(false);
      isMutedRef.current = false;

      // Identify active microphone device label
      const tracks = stream.getAudioTracks();
      if (tracks.length > 0 && tracks[0].label) {
        setMicDeviceLabel(tracks[0].label);
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close().catch(() => {});
          } catch {}
        }
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateMeter = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          // Ultra-sensitive mapping so normal speaking produces 35-85% level
          const level = Math.min(100, Math.round((average / 38) * 100));
          setMicAudioLevel(level);

          // Voice Activity Detection (VAD): Auto-detect speech when level > 12%
          if (!isMutedRef.current && !isSpeakingRef.current && !isTriggeringRef.current) {
            if (level > 12) {
              if (!isRecordingAudioRef.current) {
                startAudioRecording();
              }
              clearTimeout(silenceTimeoutRef.current);
            } else if (isRecordingAudioRef.current && !isTapToSpeakingRef.current) {
              // User has paused speaking: wait 750ms of quiet before finalizing audio
              clearTimeout(silenceTimeoutRef.current);
              silenceTimeoutRef.current = setTimeout(() => {
                if (isRecordingAudioRef.current && !isTapToSpeakingRef.current) {
                  stopAudioRecording();
                }
              }, 750);
            }
          }

          animationFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }

      startRecognitionSafely();
      return true;
    } catch (err: any) {
      console.warn('Microphone permission or stream access:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setMicPermissionState('denied');
      }
      return false;
    }
  }, [startAudioRecording, startRecognitionSafely, stopAudioRecording]);

  // Tap to speak / Push to talk toggle
  const startTapToSpeak = useCallback(async () => {
    if (isSpeakingRef.current) {
      cancelSpeech();
      setIsSpeaking(false);
    }

    if (micPermissionState !== 'granted' || !mediaStreamRef.current) {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }

    playChuckWakeChime();
    setIsTapToSpeaking(true);
    setLiveTranscript('🔴 Chuck is listening... Speak your question now');
    startAudioRecording();
  }, [micPermissionState, requestMicrophoneAccess, startAudioRecording]);

  const stopTapToSpeak = useCallback(() => {
    setIsTapToSpeaking(false);
    stopAudioRecording();
  }, [stopAudioRecording]);

  const toggleTapToSpeak = useCallback(() => {
    if (isRecordingAudio || isTapToSpeaking) {
      stopTapToSpeak();
    } else {
      startTapToSpeak();
    }
  }, [isRecordingAudio, isTapToSpeaking, startTapToSpeak, stopTapToSpeak]);

  const stopSpeaking = useCallback(() => {
    cancelSpeech();
    setIsSpeaking(false);
    isTriggeringRef.current = false;
    if (!isMutedRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = setTimeout(() => {
        startRecognitionSafely();
      }, 200);
    }
  }, [startRecognitionSafely]);

  // Evaluates spoken utterance with forgiving accent matching
  const evaluateChuckUtterance = useCallback((transcript: string): string | null => {
    const text = transcript.trim();
    if (!text || text.length < 2) return null;
    const lower = text.toLowerCase();

    // 1. Audio and mic check phrases
    if (
      lower.includes('can you hear me') ||
      lower.includes('are you listening') ||
      lower.includes('are you there') ||
      lower.includes('can you hear') ||
      lower.includes('hear me') ||
      lower.includes('hello chuck') ||
      lower.includes('hey chuck') ||
      lower.includes('hi chuck')
    ) {
      return text;
    }

    // 2. Explicit Chuck wake patterns
    const chuckMatch = lower.match(
      /^(hey\s+|ok\s+|hello\s+|hi\s+|yo\s+)?(chuck|chuk|chak|check|chack|chopper|chock|shuck|truck|jack|chat|chunk|shock|chug|doc|clerk|talk)\b[:,]?\s*(.*)$/i
    );

    if (chuckMatch) {
      const questionPart = (chuckMatch[3] || '').trim();
      return questionPart || text;
    }

    // 3. Mentioning Chuck anywhere in sentence
    if (/\b(chuck|chuk|chak|check|chack|chopper|chock|chat|chunk)\b/i.test(lower)) {
      return text;
    }

    // 4. Any health keyword
    const healthKeywords = [
      'update',
      'briefing',
      'sugar',
      'glucose',
      'bp',
      'pressure',
      'blood',
      'heart',
      'step',
      'walk',
      'medicine',
      'medication',
      'pill',
      'tablet',
      'dose',
      'appointment',
      'doctor',
      'jenkins',
      'food',
      'eat',
      'diet',
      'breakfast',
      'lunch',
      'dinner',
      'meal',
      'routine',
      'timetable',
      'report',
      'restock',
      'water',
      'mood',
      'headache',
      'pain',
      'tired',
      'help',
      'emergency',
    ];

    if (healthKeywords.some((keyword) => lower.includes(keyword))) {
      return text;
    }

    // 5. Complete question or statement
    if (
      /^(what|how|when|why|who|where|can|should|is|are|tell|give|check|do|does|will|am\s+i)\b/i.test(
        lower
      ) &&
      text.length > 5
    ) {
      return text;
    }

    // 6. If 3 or more words spoken clearly
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 3) {
      return text;
    }

    return null;
  }, []);

  // Process accumulated speech after natural pause
  const processSpokenPhrase = useCallback(
    (phrase: string) => {
      if (isSpeakingRef.current || isTriggeringRef.current) return;
      const clean = phrase.trim();
      if (!clean) return;

      const matchedQuestion = evaluateChuckUtterance(clean);
      if (matchedQuestion) {
        setLastTranscript(clean);
        askChuckQuestion(matchedQuestion);
      }
    },
    [askChuckQuestion, evaluateChuckUtterance]
  );

  // Speech Recognition setup & auto-start
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSpeechRecognitionSupported(false);
      setAudioEngine('gemini-multimodal');
    } else {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionState('granted');
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition status/error:', event?.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          // If browser blocks Web Speech API in iframe, fallback to Gemini Multimodal Audio
          setAudioEngine('gemini-multimodal');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (!isMutedRef.current && !isSpeakingRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (!isMutedRef.current && !isSpeakingRef.current) {
              startRecognitionSafely();
            }
          }, 200);
        }
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const phrase = result[0]?.transcript || '';
          if (result.isFinal) {
            final += phrase;
          } else {
            interim += phrase;
          }
        }

        const activeText = (final || interim).trim();
        if (activeText) {
          setLiveTranscript(activeText);
          setLastTranscript(activeText);
          accumulatedSpeechRef.current = activeText;
        }

        clearTimeout(debounceProcessTimeoutRef.current);
        debounceProcessTimeoutRef.current = setTimeout(() => {
          if (accumulatedSpeechRef.current && !isSpeakingRef.current) {
            processSpokenPhrase(accumulatedSpeechRef.current);
          }
        }, 650);
      };

      recognitionRef.current = recognition;
    }

    // Try starting audio meter if unmuted
    if (!isMutedRef.current) {
      requestMicrophoneAccess();
    }

    // Keep mic unmuted and active on user gestures
    const keepMicUnmuted = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      if (
        !isMutedRef.current &&
        !isSpeakingRef.current &&
        !isListeningRef.current &&
        micPermissionState === 'granted'
      ) {
        startRecognitionSafely();
      }
    };

    window.addEventListener('pointerdown', keepMicUnmuted, { passive: true });
    window.addEventListener('keydown', keepMicUnmuted, { passive: true });
    window.addEventListener('focus', keepMicUnmuted, { passive: true });

    return () => {
      clearTimeout(restartTimeoutRef.current);
      clearTimeout(debounceProcessTimeoutRef.current);
      clearTimeout(silenceTimeoutRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('pointerdown', keepMicUnmuted);
      window.removeEventListener('keydown', keepMicUnmuted);
      window.removeEventListener('focus', keepMicUnmuted);
      try {
        recognitionRef.current?.stop();
      } catch {}
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [processSpokenPhrase, requestMicrophoneAccess, startRecognitionSafely, micPermissionState]);

  // Unmute mic
  const unmuteMic = useCallback(() => {
    setIsMuted(false);
    isMutedRef.current = false;
    requestMicrophoneAccess();
  }, [requestMicrophoneAccess]);

  // Mute mic
  const muteMic = useCallback(() => {
    setIsMuted(true);
    isMutedRef.current = true;
    clearTimeout(restartTimeoutRef.current);
    clearTimeout(debounceProcessTimeoutRef.current);
    clearTimeout(silenceTimeoutRef.current);
    stopAudioRecording();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch {}
    }
  }, [stopAudioRecording]);

  const toggleListening = useCallback(() => {
    if (!isMuted) {
      muteMic();
    } else {
      unmuteMic();
    }
  }, [isMuted, muteMic, unmuteMic]);

  // Manual test hearing
  const testMicHearing = useCallback(() => {
    playChuckWakeChime();
    askChuckQuestion('Can you hear me?');
  }, [askChuckQuestion]);

  return {
    isListening,
    isRecordingAudio,
    isTapToSpeaking,
    isMuted,
    isSpeaking,
    lastTranscript,
    liveTranscript,
    matchedWakePhrase,
    isSpeechRecognitionSupported,
    micPermissionState,
    micDeviceLabel,
    activeSpeechScript,
    isCompilingScript,
    micAudioLevel,
    audioEngine,
    askChuckQuestion,
    askChuckWithAudioBlob,
    triggerTinnyBriefing: askChuckQuestion,
    stopSpeaking,
    startListening: unmuteMic,
    stopListening: muteMic,
    toggleListening,
    unmuteMic,
    muteMic,
    requestMicrophoneAccess,
    startTapToSpeak,
    stopTapToSpeak,
    toggleTapToSpeak,
    testMicHearing,
  };
}

export const useTinnyVoiceAssistant = useChuckVoiceAssistant;
