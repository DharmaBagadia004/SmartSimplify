import React, { useMemo, useRef, useState } from 'react';
import { simplify, extractPdf } from './api';
import Toolbar from './components/Toolbar';
import DiffView from './components/DiffView';
import VoiceSimplifyButton from './components/VoiceSimplifyButton';

const LEVELS = ['basic', 'intermediate', 'advanced'] as const;

type Resp = {
  simplified: string;
  fkgl_before: number;
  fkgl_after: number;
  length_ratio: number;
  inline_diff_html: string;
};

function StepsSection() {
  const steps = [
    { num: 1, title: 'Enter the text', desc: 'Paste or type the text you want to simplify.' },
    {
      num: 2,
      title: 'Adjust settings',
      desc: 'Choose simplification level and accessibility options.',
    },
    {
      num: 3,
      title: 'Generate output',
      desc: 'Review the simplified text and inline changes.',
    },
  ];
  return (
    <section className="steps-section">
      <h2 className="steps-title">Use the Text Simplifier in three simple steps</h2>
      <div className="steps-grid">
        {steps.map(s => (
          <div key={s.num}>
            <div className="step-circle">{s.num}</div>
            <div className="step-title">{s.title}</div>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Resp | null>(null);
  const [levelIndex, setLevelIndex] = useState(1);
  const [view, setView] = useState<'side' | 'inline' | 'simple'>('side');
  const [busy, setBusy] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [showInline, setShowInline] = useState(true);
  const [lastMatchedIndex, setLastMatchedIndex] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const level = LEVELS[levelIndex];
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  async function onPdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setBusy(true);
      const { text } = await extractPdf(file);
      setInput(text);
      setLastMatchedIndex(null); // reset any previous match
    } catch (err: any) {
      console.error(err);
      alert("Could not extract text from the PDF. Make sure it's not a scanned image-only PDF.");
    } finally {
      setBusy(false);
      // allow re-uploading the same file if needed
      e.target.value = "";
    }
  }
  async function onSimplifySelection() {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (start === end) {
      alert("Please select a paragraph or some text in the box first.");
      return;
    }

    const fullText = ta.value;
    const selectedRaw = fullText.slice(start, end);

    // Optional: expand to whole line/paragraph
    let s = start;
    while (s > 0 && fullText[s - 1] !== '\n') s--;
    let e = end;
    while (e < fullText.length && fullText[e] !== '\n') e++;

    const paragraph = fullText.slice(s, e).trim() || selectedRaw.trim();

    await runSimplify(paragraph);
  }

  async function runSimplify(text?: string) {
    const toSend = (text ?? input).trim();
    if (!toSend) return;
    setBusy(true);
    try {
      const data = await simplify(toSend, level);
      setResult(data);
    } finally {
      setBusy(false);
    }
  }

  function onSpeak() {
    const utter = new SpeechSynthesisUtterance(
      (result?.simplified || input || 'Please provide some text.').slice(0, 8000)
    );
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }

  // paragraph matching for voice
  function splitParagraphs(text: string): string[] {
    return text
      .split(/\r?\n\s*\r?\n/)
      .map(p => p.trim())
      .filter(Boolean);
  }
  function normalize(s: string) {
    return s
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function tokenSet(s: string) {
    return new Set(normalize(s).split(' ').filter(Boolean));
  }
  function jaccard(a: Set<string>, b: Set<string>) {
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    return inter / Math.max(1, a.size + b.size - inter);
  }
  async function onHeardPrefix(transcript: string) {
    const paragraphs = splitParagraphs(input);
    if (paragraphs.length === 0) {
      alert('Please paste some text first.');
      return;
    }
    const spokenTokens = tokenSet(transcript);
    let bestIdx = -1;
    let bestScore = -1;
    paragraphs.forEach((p, i) => {
      const firstPhrase = normalize(p).split(' ').slice(0, 15).join(' ');
      const score = jaccard(spokenTokens, tokenSet(firstPhrase));
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    });
    if (bestScore < 0.15 || bestIdx === -1) {
      alert(`Couldn't confidently match a paragraph for: "${transcript}".`);
      return;
    }
    setLastMatchedIndex(bestIdx);
    await runSimplify(paragraphs[bestIdx]);
  }

  // stats
  const stats = useMemo(() => {
    const characters = input.length;
    const words = input.trim()
      ? input
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
      : 0;
    const sentences = input
      ? input
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(Boolean).length
      : 0;
    const paragraphs = splitParagraphs(input).length || (input.trim() ? 1 : 0);
    return { characters, words, sentences, paragraphs };
  }, [input]);

  const rootClass = [
    'app-root',
    dyslexia ? 'dyslexia-font' : '',
    highContrast ? 'high-contrast' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <header className="app-header">
        <h1 className="app-header-title">Text Simplifier</h1>
      </header>

      <main className="app-main">
        {/* main card */}
        <section className="card">
          <div className="grid-main">
            {/* left: input */}
            <div className="input-panel">
              <div className="input-panel-header">
                <div>
                  <h2 className="input-title">Write about</h2>
                  <p className="input-subtitle">
                    Paste or type the text you want to simplify.
                  </p>
                  {lastMatchedIndex !== null && (
                    <p className="input-subtitle">
                      Matched paragraph #{lastMatchedIndex + 1} from voice input.
                    </p>
                  )}
                </div>
                <div>
                  <div className="language-label">Language</div>
                  <select className="language-select" value="en" disabled>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                className="input-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste a complex paragraph, instructions, or an email here…"
              />


              <div className="input-actions">
                {/* PDF upload */}
                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  📄 Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={onPdfChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Simplify selection */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onSimplifySelection}
                >
                  ✂ Simplify Selection
                </button>

                {/* Existing buttons */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  Advanced options
                </button>

                <VoiceSimplifyButton onTranscript={onHeardPrefix} />

                <button
                  type="button"
                  onClick={() => runSimplify()}
                  disabled={busy}
                  className="btn btn-primary"
                >
                  {busy ? 'Generating…' : 'Generate Output'}
                </button>
              </div>


              {showAdvanced && (
                <Toolbar
                  levelIndex={levelIndex}
                  setLevelIndex={setLevelIndex}
                  showInline={showInline}
                  setShowInline={setShowInline}
                  highContrast={highContrast}
                  setHighContrast={setHighContrast}
                  dyslexia={dyslexia}
                  setDyslexia={setDyslexia}
                  onSpeak={onSpeak}
                />
              )}
            </div>

            {/* right: stats */}
            <aside className="stats-panel">
              <h3 className="stats-title">Text statistics</h3>
              <div className="stats-group">
                <div>
                  <div>Characters</div>
                  <div className="stats-number">{stats.characters}</div>
                </div>
                <div>
                  <div>Words</div>
                  <div className="stats-number">{stats.words}</div>
                </div>
                <div>
                  <div>Sentences</div>
                  <div className="stats-number">{stats.sentences}</div>
                </div>
                <div>
                  <div>Paragraphs</div>
                  <div className="stats-number">{stats.paragraphs}</div>
                </div>
              </div>
              {result && (
                <div className="stats-extra">
                  <div>
                    FKGL: {result.fkgl_before.toFixed(1)} →{' '}
                    <strong>{result.fkgl_after.toFixed(1)}</strong>
                  </div>
                  <div>
                    Length:{' '}
                    <strong>{(result.length_ratio * 100).toFixed(0)}%</strong>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* output card */}
        <section className="card card--output">
          <div className="output-card">
            <div className="output-header">
              <div>
                <h2 className="output-title">Simplified Output</h2>
                <p className="output-subtitle">
                  Switch views to compare the original and simplified versions.
                </p>
              </div>
              <div className="btn-pill-group">
                <button
                  type="button"
                  className={`btn-pill ${view === 'side' ? 'btn-pill--active' : ''}`}
                  onClick={() => setView('side')}
                >
                  Side-by-side
                </button>
                <button
                  type="button"
                  className={`btn-pill ${view === 'inline' ? 'btn-pill--active' : ''}`}
                  onClick={() => setView('inline')}
                >
                  Inline
                </button>
                <button
                  type="button"
                  className={`btn-pill ${view === 'simple' ? 'btn-pill--active' : ''}`}
                  onClick={() => setView('simple')}
                >
                  Simplified
                </button>
              </div>
            </div>

            <div className="output-body">
              {!result && (
                <p style={{ fontSize: 14, color: '#6b7280' }}>
                  After you generate output, the simplified text and inline highlights will
                  appear here.
                </p>
              )}

              {result && (
                <>
                  {view === 'side' && (
                    <>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        Simplified text
                      </h3>
                      <p style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                        {result.simplified}
                      </p>

                      {showInline && (
                        <>
                          <h3
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              marginTop: 16,
                              marginBottom: 4,
                            }}
                          >
                            Inline highlights
                          </h3>
                          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
                            <span style={{ textDecoration: 'line-through', color: '#b91c1c' }}>
                              Removed
                            </span>{' '}
                            text,{' '}
                            <span style={{ background: '#d1fae5', padding: '0 3px' }}>
                              added or changed
                            </span>
                            .
                          </p>
                          <DiffView html={result.inline_diff_html} />
                        </>
                      )}
                    </>
                  )}

                  {view === 'inline' && (
                    <>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        Inline highlights
                      </h3>
                      <DiffView html={result.inline_diff_html} />
                    </>
                  )}

                  {view === 'simple' && (
                    <>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        Simplified text
                      </h3>
                      <p style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                        {result.simplified}
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <StepsSection />
      </main>
    </div>
  );
}
