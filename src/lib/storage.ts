import "server-only";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

/**
 * Basit dosya tabanlı kayıt. Vercel gibi salt-okunur ortamlarda sessizce atlanır.
 * ORDERS_DIR ile dizin değiştirilebilir (varsayılan: ./data).
 */
const baseDir = process.env.ORDERS_DIR ?? path.join(process.cwd(), "data");

export async function saveJson(folder: string, name: string, payload: unknown): Promise<boolean> {
  try {
    const dir = path.join(/*turbopackIgnore: true*/ baseDir, folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(/*turbopackIgnore: true*/ dir, `${name}.json`), JSON.stringify(payload, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function appendLine(file: string, line: string): Promise<boolean> {
  try {
    await mkdir(baseDir, { recursive: true });
    await appendFile(path.join(/*turbopackIgnore: true*/ baseDir, file), line + "\n", "utf8");
    return true;
  } catch {
    return false;
  }
}
