/**
 * 🗄️ Database Layer - Central Barrel Export
 * Exposes Supabase clients, database entity types, canonical taxonomy, and seed data.
 */

export * from './types';
export * from './taxonomy';
export * from './seed';
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';
