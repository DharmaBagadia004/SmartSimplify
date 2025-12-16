import re


VOWELS = "aeiouy"


def count_syllables(word: str) -> int:
    w = word.lower()
    w = re.sub(r"[^a-z]", "", w)
    if not w:
        return 0    
    syllables = 0
    prev_vowel = False
    for ch in w:
        is_vowel = ch in VOWELS
        if is_vowel and not prev_vowel:
            syllables += 1
        prev_vowel = is_vowel
    if w.endswith("e") and syllables > 1:
        syllables -= 1
    return max(syllables, 1)


def sentence_count(text: str) -> int:
    return max(1, len(re.findall(r"[.!?]+", text)))


def word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def fkgl(text: str) -> float:
    words = word_count(text)
    sentences = sentence_count(text)
    syllables = sum(count_syllables(w) for w in re.findall(r"\b\w+\b", text))
    return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59


def length_ratio(orig: str, simp: str) -> float:
    ow = word_count(orig)
    sw = word_count(simp)
    return sw / max(1, ow)