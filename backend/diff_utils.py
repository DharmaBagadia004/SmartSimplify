from difflib import SequenceMatcher


def diff_html(orig: str, simp: str) -> str:
    o_words = orig.split()
    s_words = simp.split()
    sm = SequenceMatcher(None, o_words, s_words)
    out = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            out.append(' '.join(o_words[i1:i2]))
        elif tag == 'delete':
            out.append(f"<del class='bg-red-100 line-through'>{' '.join(o_words[i1:i2])}</del>")
        elif tag == 'insert':
            out.append(f"<ins class='bg-green-100'>{' '.join(s_words[j1:j2])}</ins>")
        elif tag == 'replace':
            out.append(f"<del class='bg-red-100 line-through'>{' '.join(o_words[i1:i2])}</del> "
        f"<ins class='bg-green-100'>{' '.join(s_words[j1:j2])}</ins>")
    return ' '.join(out)