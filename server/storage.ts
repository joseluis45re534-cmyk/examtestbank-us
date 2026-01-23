import { MemStorage } from "./storage_mem";
import { IStorage } from "./storage_interface";
export * from "./storage_interface";

// For Cloudflare ease-of-use, we default to MemStorage.
// The complex DB storage can be moved to storage_db.ts if needed later.
export let storage: IStorage = new MemStorage();

export function initializeStorage(newStorage: IStorage) {
    storage = newStorage;
}
