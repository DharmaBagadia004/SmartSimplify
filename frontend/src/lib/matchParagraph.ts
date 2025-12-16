// src/lib/matchParagraph.ts
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

export function splitParagraphs(text: string): string[] {
    // split on blank lines; also fallback to single \n\n or windows newlines
    return text
        .split(/\r?\n\s*\r?\n/)
        .map(p => p.trim())
        .filter(Boolean);
}

export function findBestParagraphBySpokenPrefix(fullText: string, spoken: string) {
    const paragraphs = splitParagraphs(fullText);
    if (paragraphs.length === 0) return { index: -1, paragraph: '' };

    const spokenNorm = normalize(spoken);
    const spokenTokens = tokenSet(spoken);

    let bestIdx = -1;
    let bestScore = -1;

    paragraphs.forEach((p, i) => {
        const pNorm = normalize(p);
        // 1) strong bonus if paragraph starts with the spoken prefix words
        const prefixBonus = pNorm.startsWith(spokenNorm) ? 0.5 : 0;

        // 2) jaccard overlap on tokens (first N words of paragraph to avoid long-text bias)
        const firstPhrase = pNorm.split(' ').slice(0, 15).join(' ');
        const score = jaccard(spokenTokens, tokenSet(firstPhrase)) + prefixBonus;

        if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
        }
    });

    // require a minimum score to avoid mismatching
    if (bestScore < 0.15) return { index: -1, paragraph: '' };
    return { index: bestIdx, paragraph: paragraphs[bestIdx] };
}
