export async function simplify(text: string, level: string) {
    const res = await fetch("http://localhost:5050/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, level })
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
}
const BASE_URL = "http://127.0.0.1:5050"; // or your existing base URL

export async function extractPdf(file: File): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/extract_pdf`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to extract text from PDF");
    }

    return res.json();
}
