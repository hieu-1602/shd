import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';
import { invoices, costumes } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isDbConfigured = (): boolean => {
  return Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME);
};

export const getPool = (): Pool => {
  if (!isDbConfigured()) {
    throw new Error('PostgreSQL database not configured (SQL_HOST/SQL_DB_NAME missing)');
  }
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      keepAlive: true,
    });

    global._postgresPool.on('error', (err: any) => {
      console.warn('PostgreSQL idle client notice:', err?.message || err);
      if (err?.code === '57P01' || err?.message?.includes('terminating connection')) {
        global._postgresPool = undefined;
      }
    });
  }
  return global._postgresPool;
};

export const createPool = getPool;

let _db: any;
try {
  if (isDbConfigured()) {
    _db = drizzle(getPool(), { schema });
  } else {
    const noOp = {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (d: any) => d?.data ?? {},
      update: async (d: any) => d?.data ?? {},
      delete: async () => ({}),
    };
    _db = new Proxy({}, {
      get: (_, prop) => (prop === 'query' ? new Proxy({}, { get: () => noOp }) : async () => []),
    });
  }
} catch {
  console.warn('[AI Studio] Database not connected — using fallback');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  _db = new Proxy({}, {
    get: (_, prop) => (prop === 'query' ? new Proxy({}, { get: () => noOp }) : async () => []),
  });
}

export const getDb = () => {
  if (!isDbConfigured()) {
    return _db;
  }
  return drizzle(getPool(), { schema });
};

export const db = _db;

// Auto-recovery wrapper for transient connection drops (e.g. 57P01 admin shutdown or proxy restart)
async function withDbRetry<T>(operation: () => Promise<T>): Promise<T> {
  if (!isDbConfigured()) {
    throw new Error('PostgreSQL database not configured');
  }
  try {
    return await operation();
  } catch (error: any) {
    const isConnTerminated =
      error?.code === '57P01' ||
      error?.message?.includes('terminating connection') ||
      error?.cause?.code === '57P01' ||
      error?.cause?.message?.includes('terminating connection') ||
      error?.message?.includes('Connection terminated unexpectedly');

    if (isConnTerminated) {
      console.warn('PostgreSQL connection dropped by server/proxy. Refreshing pool and retrying query...');
      try {
        global._postgresPool?.end().catch(() => {});
      } catch {
        // Ignore
      }
      global._postgresPool = undefined;

      await new Promise((resolve) => setTimeout(resolve, 600));
      return await operation();
    }
    throw error;
  }
}

// Invoices (Bộ trang phục / Custom Outfits) Database Helpers
export async function getAllInvoices() {
  try {
    return await withDbRetry(async () => {
      const currentDb = getDb();
      const rows = await currentDb.select().from(invoices).orderBy(desc(invoices.createdAt));
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        creatorName: r.creatorName || '',
        gender: (r.gender as 'Nam' | 'Nữ') || 'Nam',
        createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
        imageUrl: r.imageUrl || '',
        imageUrls: Array.isArray(r.imageUrls) ? r.imageUrls : [],
        heroColor: r.heroColor || '#9E2A2B',
        colorLabel: r.colorLabel || '',
        material: r.material || '',
        era: r.era || 'Triều Nguyễn',
        region: r.region || 'Cố đô Huế',
        introduction: r.introduction || '',
        occasion: r.occasion as any,
        components: Array.isArray(r.components) ? r.components : [],
      }));
    });
  } catch (error) {
    if (isDbConfigured()) {
      console.warn('Database query for invoices warning:', (error as any)?.message || error);
    }
    throw error;
  }
}

export async function upsertInvoice(outfit: any) {
  try {
    return await withDbRetry(async () => {
      const currentDb = getDb();
      const safeId = String(outfit.id || `outfit_${Date.now()}`);
      const safeName = String(outfit.name || 'Bộ Cổ Phục Di Sản');
      const safeCreatorName = outfit.creatorName ? String(outfit.creatorName) : '';
      const safeGender = outfit.gender ? String(outfit.gender) : 'Nam';
      const safeImageUrl = outfit.imageUrl ? String(outfit.imageUrl) : '';
      const safeImageUrls = Array.isArray(outfit.imageUrls) ? outfit.imageUrls : (safeImageUrl ? [safeImageUrl] : []);
      const safeHeroColor = outfit.heroColor ? String(outfit.heroColor) : '#9E2A2B';
      const safeColorLabel = outfit.colorLabel ? String(outfit.colorLabel) : '';
      const safeMaterial = outfit.material ? String(outfit.material) : '';
      const safeEra = outfit.era ? String(outfit.era) : 'Triều Nguyễn';
      const safeRegion = outfit.region ? String(outfit.region) : 'Cố đô Huế';
      const safeIntroduction = outfit.introduction ? String(outfit.introduction) : '';
      const safeOccasion = outfit.occasion ? String(outfit.occasion) : '';
      const safeComponents = Array.isArray(outfit.components) ? outfit.components : [];

      const existing = await currentDb.select().from(invoices).where(eq(invoices.id, safeId)).limit(1);
      if (existing.length > 0) {
        await currentDb.update(invoices).set({
          name: safeName,
          creatorName: safeCreatorName,
          gender: safeGender,
          imageUrl: safeImageUrl,
          imageUrls: safeImageUrls,
          heroColor: safeHeroColor,
          colorLabel: safeColorLabel,
          material: safeMaterial,
          era: safeEra,
          region: safeRegion,
          introduction: safeIntroduction,
          occasion: safeOccasion,
          components: safeComponents,
          updatedAt: new Date(),
        }).where(eq(invoices.id, safeId));
      } else {
        await currentDb.insert(invoices).values({
          id: safeId,
          name: safeName,
          creatorName: safeCreatorName,
          gender: safeGender,
          imageUrl: safeImageUrl,
          imageUrls: safeImageUrls,
          heroColor: safeHeroColor,
          colorLabel: safeColorLabel,
          material: safeMaterial,
          era: safeEra,
          region: safeRegion,
          introduction: safeIntroduction,
          occasion: safeOccasion,
          components: safeComponents,
          createdAt: new Date(outfit.createdAt || Date.now()),
          updatedAt: new Date(),
        });
      }
      return outfit;
    });
  } catch (error) {
    console.warn('Database upsert for invoice warning:', (error as any)?.message || error);
    throw error;
  }
}

export async function deleteInvoiceById(id: string) {
  try {
    return await withDbRetry(async () => {
      const currentDb = getDb();
      await currentDb.delete(invoices).where(eq(invoices.id, id));
    });
  } catch (error) {
    console.warn('Database delete for invoice warning:', (error as any)?.message || error);
    throw error;
  }
}

// Costumes Database Helpers
export async function getAllCostumes() {
  try {
    return await withDbRetry(async () => {
      const currentDb = getDb();
      const rows = await currentDb.select().from(costumes).orderBy(desc(costumes.createdAt));
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category as any,
        era: r.era || 'Triều Nguyễn',
        region: r.region || 'Cố đô Huế',
        gender: (r.gender as 'Nam' | 'Nữ') || 'Nam',
        heroColor: r.heroColor || '#9E2A2B',
        colorLabel: r.colorLabel || '',
        secondaryColor: r.secondaryColor || '',
        material: r.material || '',
        originStory: r.originStory || '',
        culturalMeaning: r.culturalMeaning || '',
        remixTips: r.remixTips || '',
        culturalAdvisory: r.culturalAdvisory || '',
        imageUrl: r.imageUrl || '',
        imageUrls: Array.isArray(r.imageUrls) ? r.imageUrls : [],
        accentPattern: (r.accentPattern as any) || undefined,
        suitableOccasions: (Array.isArray(r.suitableOccasions) ? r.suitableOccasions : []) as any,
        creatorName: r.creatorName || '',
      }));
    });
  } catch (error) {
    if (isDbConfigured()) {
      console.warn('Database query for costumes warning:', (error as any)?.message || error);
    }
    throw error;
  }
}

export async function upsertCostume(item: any) {
  try {
    return await withDbRetry(async () => {
      const currentDb = getDb();
      const safeId = String(item.id || `item_${Date.now()}`);
      const safeName = String(item.name || 'Trang Phục Di Sản');
      const safeCategory = String(item.category || 'ao_ngoai');
      const safeEra = item.era ? String(item.era) : 'Triều Nguyễn';
      const safeRegion = item.region ? String(item.region) : 'Cố đô Huế';
      const safeGender = item.gender ? String(item.gender) : 'Nam';
      const safeHeroColor = item.heroColor ? String(item.heroColor) : '#9E2A2B';
      const safeColorLabel = item.colorLabel ? String(item.colorLabel) : '';
      const safeSecondaryColor = item.secondaryColor ? String(item.secondaryColor) : '';
      const safeMaterial = item.material ? String(item.material) : '';
      const safeOriginStory = item.originStory ? String(item.originStory) : '';
      const safeCulturalMeaning = item.culturalMeaning ? String(item.culturalMeaning) : '';
      const safeRemixTips = item.remixTips ? String(item.remixTips) : '';
      const safeCulturalAdvisory = item.culturalAdvisory ? String(item.culturalAdvisory) : '';
      const safeImageUrl = item.imageUrl ? String(item.imageUrl) : '';
      const safeImageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : (safeImageUrl ? [safeImageUrl] : []);
      const safeAccentPattern = item.accentPattern ? String(item.accentPattern) : '';
      const safeOccasions = Array.isArray(item.suitableOccasions) ? item.suitableOccasions : [];
      const safeCreatorName = item.creatorName ? String(item.creatorName) : '';

      const existing = await currentDb.select().from(costumes).where(eq(costumes.id, safeId)).limit(1);
      if (existing.length > 0) {
        await currentDb.update(costumes).set({
          name: safeName,
          category: safeCategory,
          era: safeEra,
          region: safeRegion,
          gender: safeGender,
          heroColor: safeHeroColor,
          colorLabel: safeColorLabel,
          secondaryColor: safeSecondaryColor,
          material: safeMaterial,
          originStory: safeOriginStory,
          culturalMeaning: safeCulturalMeaning,
          remixTips: safeRemixTips,
          culturalAdvisory: safeCulturalAdvisory,
          imageUrl: safeImageUrl,
          imageUrls: safeImageUrls,
          accentPattern: safeAccentPattern,
          suitableOccasions: safeOccasions,
          creatorName: safeCreatorName,
        }).where(eq(costumes.id, safeId));
      } else {
        await currentDb.insert(costumes).values({
          id: safeId,
          name: safeName,
          category: safeCategory,
          era: safeEra,
          region: safeRegion,
          gender: safeGender,
          heroColor: safeHeroColor,
          colorLabel: safeColorLabel,
          secondaryColor: safeSecondaryColor,
          material: safeMaterial,
          originStory: safeOriginStory,
          culturalMeaning: safeCulturalMeaning,
          remixTips: safeRemixTips,
          culturalAdvisory: safeCulturalAdvisory,
          imageUrl: safeImageUrl,
          imageUrls: safeImageUrls,
          accentPattern: safeAccentPattern,
          suitableOccasions: safeOccasions,
          creatorName: safeCreatorName,
          createdAt: new Date(),
        });
      }
      return item;
    });
  } catch (error) {
    console.warn('Database upsert for costume warning:', (error as any)?.message || error);
    throw error;
  }
}

export async function deleteCostumeById(id: string) {
  try {
    return await withDbRetry(async () => {
      const currentDb = getDb();
      await currentDb.delete(costumes).where(eq(costumes.id, id));
    });
  } catch (error) {
    console.warn('Database delete for costume warning:', (error as any)?.message || error);
    throw error;
  }
}
