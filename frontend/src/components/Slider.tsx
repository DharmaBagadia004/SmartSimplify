import React from 'react';

type Props = {
    value: number;
    onChange: (v: number) => void;
    labels: string[];
};

const Slider: React.FC<Props> = ({ value, onChange, labels }) => {
    return (
        <div>
            <input
                type="range"
                min={0}
                max={labels.length - 1}
                value={value}
                onChange={e => onChange(parseInt(e.target.value, 10))}
                className="slider"
            />
            <div className="slider-labels">
                {labels.map((l, i) => (
                    <span key={i}>{l}</span>
                ))}
            </div>
        </div>
    );
};

export default Slider;
