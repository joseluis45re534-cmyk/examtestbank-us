import { MemStorage } from "./storage_mem";
export * from "./storage_interface";

// For Cloudflare ease-of-use, we default to MemStorage.
// The complex DB storage can be moved to storage_db.ts if needed later.
export const storage = new MemStorage();
