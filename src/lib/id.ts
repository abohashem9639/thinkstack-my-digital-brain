import { nanoid } from "nanoid";

/**
 * Generate a unique ID for new entities.
 * Uses nanoid for short, URL-safe IDs.
 */
export const generateId = (): string => nanoid();

/**
 * Get current date as ISO string (YYYY-MM-DD)
 */
export const today = (): string => new Date().toISOString().split("T")[0];

/**
 * Get current ISO timestamp
 */
export const now = (): string => new Date().toISOString();
