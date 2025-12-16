import hashlib, os, sqlite3, time


DB_PATH = os.path.join(os.path.dirname(__file__), "cache.sqlite")


def _ensure_table():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
    """
    CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    ts REAL NOT NULL
    )
    """
    )
    conn.commit(); conn.close()


_ensure_table()


def _key(text: str, level: str, model: str) -> str:
    h = hashlib.sha256(f"{level}\n{model}\n{text}".encode("utf-8")).hexdigest()
    return h


def get_cached(text: str, level: str, model: str):
    k = _key(text, level, model)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.execute("SELECT value FROM cache WHERE key=?", (k,))
    row = cur.fetchone(); conn.close()
    return row[0] if row else None


def set_cached(text: str, level: str, model: str, value: str):
    k = _key(text, level, model)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("REPLACE INTO cache(key,value,ts) VALUES(?,?,?)", (k, value, time.time()))
    conn.commit(); conn.close()