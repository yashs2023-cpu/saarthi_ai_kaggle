import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

// BCP-47 language code map
const LANG_MAP = {
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  en: 'en-IN',
};

const SILENCE_TIMEOUT_MS = 5000; // Auto-stop after 5s of silence

export default function VoiceButton({ size = 60, persona = 'default', onTranscript }) {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { language } = useLanguage();
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, SILENCE_TIMEOUT_MS);
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setListening(false);
    setInterimText('');
  }, []);

  const handleClick = useCallback(async () => {
    setErrorMsg('');

    if (listening) {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Voice not supported. Try Chrome.');
      return;
    }

    // Check microphone permission
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        if (status.state === 'denied') {
          setErrorMsg('Microphone access denied. Please allow microphone in browser settings.');
          return;
        }
      } catch {
        // Permissions API may not support microphone on all browsers — proceed anyway
      }
    }

    setListening(true);
    setInterimText('');

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = LANG_MAP[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        resetSilenceTimer();
      };

      recognition.onspeechstart = () => {
        resetSilenceTimer();
      };

      recognition.onresult = (event) => {
        resetSilenceTimer();
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        if (interim) setInterimText(interim);
        if (final) {
          setInterimText('');
          if (onTranscript) onTranscript(final.trim());
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorMsg('Microphone access denied.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech detected. Please try again.');
        } else if (event.error !== 'aborted') {
          setErrorMsg('Voice error: ' + event.error);
        }
        stopListening();
      };

      recognition.onend = () => {
        stopListening();
      };

      recognition.start();
    } catch (err) {
      setErrorMsg('Could not start microphone.');
      stopListening();
    }
  }, [listening, language, onTranscript, resetSilenceTimer, stopListening]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Pulsing ring when listening */}
      {listening && (
        <span style={{
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          border: '3px solid rgba(239,68,68,0.5)',
          animation: 'voicePulse 1.2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      <style>{`
        @keyframes voicePulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.18); opacity: 0.3; }
        }
      `}</style>

      <button
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: listening
            ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
            : 'linear-gradient(135deg, #FF9933, #E07800)',
          border: 'none',
          color: '#fff',
          fontSize: size * 0.4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: listening
            ? '0 0 0 4px rgba(239,68,68,0.3)'
            : '0 4px 14px rgba(255,153,51,0.4)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          position: 'relative',
        }}
        onClick={handleClick}
        aria-label={listening ? 'Stop listening' : 'Talk to Saarthi'}
        title={listening ? 'Listening… (click to stop)' : 'Talk to Saarthi'}
      >
        {listening ? '🔴' : '🎤'}
      </button>

      {/* Interim transcription */}
      {interimText && (
        <div style={{
          position: 'absolute',
          bottom: size + 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          fontSize: 12,
          padding: '4px 10px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          {interimText}
        </div>
      )}

      {/* Error message */}
      {errorMsg && !listening && (
        <div style={{
          position: 'absolute',
          bottom: size + 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#FEF2F2',
          color: '#991B1B',
          fontSize: 11,
          padding: '4px 10px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          maxWidth: 220,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
          border: '1px solid #FCA5A5',
          zIndex: 10,
        }}>
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}
