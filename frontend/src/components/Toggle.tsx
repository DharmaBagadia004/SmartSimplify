import React from 'react';

type Props = {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
};

export default function Toggle({ label, checked, onChange }: Props) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${checked
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                }`}
            aria-pressed={checked}
        >
            <span
                className={`inline-block h-2 w-2 rounded-full ${checked ? 'bg-emerald-900' : 'bg-slate-500'
                    }`}
            />
            {label}
        </button>
    );
}
