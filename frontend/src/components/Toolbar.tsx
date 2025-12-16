import React from 'react';
import Slider from './Slider';

type Props = {
    levelIndex: number;
    setLevelIndex: (n: number) => void;
    showInline: boolean;
    setShowInline: (b: boolean) => void;
    highContrast: boolean;
    setHighContrast: (b: boolean) => void;
    dyslexia: boolean;
    setDyslexia: (b: boolean) => void;
    onSpeak: () => void;
};

const Toolbar: React.FC<Props> = ({
    levelIndex,
    setLevelIndex,
    showInline,
    setShowInline,
    highContrast,
    setHighContrast,
    dyslexia,
    setDyslexia,
    onSpeak,
}) => {
    const labels = ['Basic', 'Intermediate', 'Advanced'];

    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <div className="toolbar-label">Simplification level</div>
                <Slider value={levelIndex} onChange={setLevelIndex} labels={labels} />
            </div>
            <div className="toolbar-toggles">
                <button
                    type="button"
                    className={`toggle-btn ${showInline ? 'toggle-btn--active' : ''}`}
                    onClick={() => setShowInline(!showInline)}
                >
                    Inline highlights
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${highContrast ? 'toggle-btn--active' : ''}`}
                    onClick={() => setHighContrast(!highContrast)}
                >
                    High contrast
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${dyslexia ? 'toggle-btn--active' : ''}`}
                    onClick={() => setDyslexia(!dyslexia)}
                >
                    Dyslexia font
                </button>
                <button type="button" className="btn btn-secondary" onClick={onSpeak}>
                    🔊 Read aloud
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
