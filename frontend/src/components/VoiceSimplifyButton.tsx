import React, { useRef, useState } from 'react';

type Props = {
    onTranscript: (text: string) => void;
};

const VoiceSimplifyButton: React.FC<Props> = ({ onTranscript }) => {
    const [listening, setListening] = useState(false);
    const recRef = useRef<any>(null);

    function start() {
        const SR: any =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
            alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
            return;
        }
        const rec = new SR();
        recRef.current = rec;
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onstart = () => setListening(true);
        rec.onerror = () => setListening(false);
        rec.onend = () => setListening(false);
        rec.onresult = (e: any) => {
            const t = e.results?.[0]?.[0]?.transcript || '';
            if (t.trim()) onTranscript(t.trim());
        };
        rec.start();
    }

    function stop() {
        recRef.current?.stop?.();
        setListening(false);
    }

    return (
        <button
            type="button"
            onClick={listening ? stop : start}
            className={`btn btn-voice ${listening ? 'listening' : ''}`}
        >
            {listening ? 'Stop listening' : '🎤 Speak to Simplify'}
        </button>
    );
};

export default VoiceSimplifyButton;
