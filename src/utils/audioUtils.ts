// Audio utilities for Chuck voice assistant (Sweet, caring voice) & Speech synthesis

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Sweet, crystal warm wake chime (gentle ascending major chord: E5 -> G#5 -> B5 -> E6)
 * Soft, melodious, and reassuring
 */
export function playChuckWakeChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const notes = [
      { freq: 659.25, time: 0.0, dur: 0.28 }, // E5
      { freq: 830.61, time: 0.06, dur: 0.28 }, // G#5
      { freq: 987.77, time: 0.12, dur: 0.32 }, // B5
      { freq: 1318.51, time: 0.18, dur: 0.45 }, // E6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0.001, now + note.time);
      gain.gain.linearRampToValueAtTime(0.12, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  } catch (e) {
    console.warn('AudioContext chime error:', e);
  }
}

export const playTinnyWakeChime = playChuckWakeChime;
export const playAlexaChime = playChuckWakeChime;
export const playJarvisChime = playChuckWakeChime;

/**
 * Finds the sweetest, warmest, and most melodious voice available in the user's browser
 * Prioritizes natural, gentle, affectionate female tones (Samantha, Libby, Sonia, Karen, Serena, Victoria, Google UK Female, etc.)
 */
export function getSweetChuckVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Known sweetest natural voices (Samantha, Libby, Sonia, Aria, Jenny, Serena)
  const sweetKeywords = [
    'samantha',
    'libby',
    'sonia',
    'aria',
    'jenny',
    'serena',
    'karen',
    'victoria',
    'ava',
    'allison',
    'fiona',
    'moira',
    'stephanie',
    'hazel',
  ];

  for (const name of sweetKeywords) {
    const found = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        v.name.toLowerCase().includes(name)
    );
    if (found) return found;
  }

  // 2. Google UK English Female / Google Natural
  const googleNatural = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      v.name.includes('Google') &&
      (v.name.includes('Female') || v.name.includes('UK') || v.lang === 'en-GB')
  );
  if (googleNatural) return googleNatural;

  // 3. Any natural UK English voice (melodic & articulate)
  const ukVoice = voices.find((v) => v.lang === 'en-GB' || v.lang.startsWith('en_GB'));
  if (ukVoice) return ukVoice;

  // 4. Any English female voice
  const femaleVoice = voices.find(
    (v) => v.lang.startsWith('en') && /female/i.test(v.name)
  );
  if (femaleVoice) return femaleVoice;

  // 5. Any English voice
  return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
}

export const getFemaleMetroVoice = getSweetChuckVoice;

/**
 * Speaks text using Chuck's sweet, affectionate, and caring voice
 */
export function speakSweetChuckVoice(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported.');
    return;
  }

  window.speechSynthesis.cancel();
  playChuckWakeChime();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getSweetChuckVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Sweet voice tuning:
    // Pitch slightly higher (1.15) gives a sweet, friendly, melodic, and cheerful warm tone
    // Rate slightly relaxed (0.96) prevents sounding rushed or robotic, making it gentle and caring
    utterance.pitch = options?.pitch ?? 1.15;
    utterance.rate = options?.rate ?? 0.96;

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onError?.();

    window.speechSynthesis.speak(utterance);
  }, 220);
}

export const speakFemaleMetroVoice = speakSweetChuckVoice;
export const speakChuckVoice = speakSweetChuckVoice;

export function cancelSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakWithFemaleMetroVoice(
  text: string,
  onEnd?: () => void,
  onStart?: () => void
) {
  speakSweetChuckVoice(text, {
    onStart,
    onEnd,
    onError: onEnd,
  });
}
