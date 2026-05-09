import Database from "better-sqlite3";
import path from "path";

const DB_PATH =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "unbabel.db");

const globalForDb = globalThis as unknown as {
  _db: Database.Database | undefined;
};

function getDatabase(): Database.Database {
  if (!globalForDb._db) {
    globalForDb._db = new Database(DB_PATH);
    globalForDb._db.pragma("journal_mode = WAL");
    globalForDb._db.pragma("busy_timeout = 5000");
    globalForDb._db.exec(SCHEMA);
  }
  return globalForDb._db;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL,
  body_original TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  hood TEXT NOT NULL,
  tenure TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT (datetime('now', '+7 days')),
  flagged INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  UNIQUE(post_id, target_lang)
);

CREATE TABLE IF NOT EXISTS directory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description_original TEXT,
  source_lang TEXT,
  category TEXT,
  hood TEXT NOT NULL,
  address TEXT,
  source TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS directory_translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  directory_id INTEGER NOT NULL REFERENCES directory(id),
  target_lang TEXT NOT NULL,
  translated_name TEXT,
  translated_description TEXT,
  UNIQUE(directory_id, target_lang)
);

CREATE TABLE IF NOT EXISTS entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  entity_type TEXT NOT NULL,
  entity_value TEXT NOT NULL,
  hood TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entities_value ON entities(entity_value);
CREATE INDEX IF NOT EXISTS idx_entities_hood ON entities(hood);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  topic TEXT NOT NULL DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(alias, post_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_alias ON bookmarks(alias);
`;

export const db = getDatabase();

// Auto-seed if DB is empty (after db export to avoid circular dep with seed.ts)
try {
  const count = db.prepare("SELECT COUNT(*) as c FROM posts").get() as { c: number };
  if (count.c === 0) {
    const { seedDatabase } = require("./seed");
    seedDatabase();
  }
} catch {
  // Ignore seed errors during build (SQLITE_BUSY from parallel workers)
}

// --- Post queries ---

export function createPost(
  alias: string,
  body: string,
  sourceLang: string,
  hood: string,
  tenure: string = "new"
) {
  const stmt = db.prepare(
    "INSERT INTO posts (alias, body_original, source_lang, hood, tenure) VALUES (?, ?, ?, ?, ?)"
  );
  return stmt.run(alias, body, sourceLang, hood, tenure);
}

export function getPostsByHood(hood: string, includeAdjacent: string[] = []) {
  const allHoods = [hood, ...includeAdjacent];
  const placeholders = allHoods.map(() => "?").join(",");
  const stmt = db.prepare(`
    SELECT * FROM posts
    WHERE hood IN (${placeholders})
      AND flagged = 0
      AND expires_at > datetime('now')
    ORDER BY created_at DESC
    LIMIT 50
  `);
  return stmt.all(...allHoods);
}

export function getPostById(id: number) {
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
}

// --- Translation cache ---

export function getCachedTranslation(postId: number, targetLang: string) {
  return db
    .prepare(
      "SELECT translated_text FROM translations WHERE post_id = ? AND target_lang = ?"
    )
    .get(postId, targetLang) as { translated_text: string } | undefined;
}

export function cacheTranslation(
  postId: number,
  targetLang: string,
  text: string
) {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO translations (post_id, target_lang, translated_text) VALUES (?, ?, ?)"
  );
  return stmt.run(postId, targetLang, text);
}

// --- Entity queries ---

export function insertEntities(
  postId: number,
  entities: { type: string; value: string }[],
  hood: string,
  sourceLang: string
) {
  const stmt = db.prepare(
    "INSERT INTO entities (post_id, entity_type, entity_value, hood, source_lang) VALUES (?, ?, ?, ?, ?)"
  );
  const insertMany = db.transaction(
    (items: { type: string; value: string }[]) => {
      for (const e of items) {
        stmt.run(postId, e.type, e.value.toLowerCase(), hood, sourceLang);
      }
    }
  );
  insertMany(entities);
}

export interface SignalCluster {
  entity_value: string;
  entity_type: string;
  lang_count: number;
  post_count: number;
  languages: string;
  post_ids: string;
}

export function getSignalClusters(
  hood: string,
  includeAdjacent: string[] = []
): SignalCluster[] {
  const allHoods = [hood, ...includeAdjacent];
  const placeholders = allHoods.map(() => "?").join(",");
  const stmt = db.prepare(`
    SELECT
      e.entity_value,
      e.entity_type,
      COUNT(DISTINCT e.source_lang) as lang_count,
      COUNT(DISTINCT e.post_id) as post_count,
      GROUP_CONCAT(DISTINCT e.source_lang) as languages,
      GROUP_CONCAT(DISTINCT e.post_id) as post_ids
    FROM entities e
    JOIN posts p ON e.post_id = p.id
    WHERE e.hood IN (${placeholders})
      AND p.flagged = 0
      AND p.expires_at > datetime('now')
    GROUP BY e.entity_value
    HAVING COUNT(DISTINCT e.source_lang) >= 2
    ORDER BY lang_count DESC, post_count DESC
    LIMIT 10
  `);
  return stmt.all(...allHoods) as SignalCluster[];
}

export interface CrossHoodSignal {
  entity_value: string;
  entity_type: string;
  hood_count: number;
  post_count: number;
  hoods: string;
  languages: string;
}

export function getCrossHoodSignals(): CrossHoodSignal[] {
  const stmt = db.prepare(`
    SELECT
      e.entity_value,
      e.entity_type,
      COUNT(DISTINCT e.hood) as hood_count,
      COUNT(DISTINCT e.post_id) as post_count,
      GROUP_CONCAT(DISTINCT e.hood) as hoods,
      GROUP_CONCAT(DISTINCT e.source_lang) as languages
    FROM entities e
    JOIN posts p ON e.post_id = p.id
    WHERE p.flagged = 0
      AND p.expires_at > datetime('now')
    GROUP BY e.entity_value
    HAVING COUNT(DISTINCT e.hood) >= 2
    ORDER BY hood_count DESC, post_count DESC
    LIMIT 5
  `);
  return stmt.all() as CrossHoodSignal[];
}

export function getPostsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const stmt = db.prepare(`
    SELECT id, alias, body_original, source_lang, hood, tenure, created_at
    FROM posts
    WHERE id IN (${placeholders})
    ORDER BY created_at DESC
  `);
  return stmt.all(...ids);
}

// --- Directory queries ---

export function getDirectoryByHood(hood: string, category?: string) {
  if (category) {
    return db
      .prepare(
        "SELECT * FROM directory WHERE hood = ? AND category = ? ORDER BY name"
      )
      .all(hood, category);
  }
  return db
    .prepare("SELECT * FROM directory WHERE hood = ? ORDER BY name")
    .all(hood);
}

export function createDirectoryEntry(entry: {
  name: string;
  description_original?: string;
  source_lang?: string;
  category?: string;
  hood: string;
  address?: string;
  source?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO directory (name, description_original, source_lang, category, hood, address, source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    entry.name,
    entry.description_original ?? null,
    entry.source_lang ?? null,
    entry.category ?? null,
    entry.hood,
    entry.address ?? null,
    entry.source ?? "user"
  );
}

export function getCachedDirectoryTranslation(
  directoryId: number,
  targetLang: string
) {
  return db
    .prepare(
      "SELECT translated_name, translated_description FROM directory_translations WHERE directory_id = ? AND target_lang = ?"
    )
    .get(directoryId, targetLang) as
    | { translated_name: string; translated_description: string }
    | undefined;
}

export function cacheDirectoryTranslation(
  directoryId: number,
  targetLang: string,
  name: string,
  description: string
) {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO directory_translations (directory_id, target_lang, translated_name, translated_description) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(directoryId, targetLang, name, description);
}

export function flagPost(id: number) {
  db.prepare("UPDATE posts SET flagged = 1 WHERE id = ?").run(id);
}

// --- Bookmark queries ---

export function addBookmark(alias: string, postId: number, topic: string) {
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO bookmarks (alias, post_id, topic) VALUES (?, ?, ?)"
  );
  return stmt.run(alias, postId, topic);
}

export function removeBookmark(alias: string, postId: number) {
  db.prepare("DELETE FROM bookmarks WHERE alias = ? AND post_id = ?").run(
    alias,
    postId
  );
}

export function getBookmarksByAlias(alias: string) {
  return db
    .prepare(
      `SELECT b.topic, p.* FROM bookmarks b
       JOIN posts p ON b.post_id = p.id
       WHERE b.alias = ?
       ORDER BY b.topic, b.created_at DESC`
    )
    .all(alias) as ({ topic: string } & Record<string, unknown>)[];
}

export function isBookmarked(alias: string, postId: number): boolean {
  const row = db
    .prepare("SELECT 1 FROM bookmarks WHERE alias = ? AND post_id = ?")
    .get(alias, postId);
  return !!row;
}
