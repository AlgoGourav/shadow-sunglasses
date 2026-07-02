import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type CartItemSubmission = {
  tintSlug: string;
  packSize: "1" | "3" | "6";
  quantity: number;
};

export type InterestSubmission = {
  name: string;
  email: string;
  phone: string;
  address: string;
  packSize: "1" | "3" | "6";
  colorPreference: string;
  cartItems?: CartItemSubmission[];
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "interest-submissions.json");

async function readAll(): Promise<InterestSubmission[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as InterestSubmission[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(entries: InterestSubmission[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function addInterestSubmission(
  submission: Omit<InterestSubmission, "createdAt">
): Promise<{ status: "created" | "duplicate" }> {
  const entries = await readAll();
  const normalizedEmail = submission.email.trim().toLowerCase();

  if (entries.some((entry) => entry.email === normalizedEmail)) {
    return { status: "duplicate" };
  }

  entries.push({
    ...submission,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  });
  await writeAll(entries);

  return { status: "created" };
}
