"use server";

import { db } from "@/db";
import { hyroxbox, regions } from "@/db/schema";
import { eq, desc, sql, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type HyroxBoxWithRegion = typeof hyroxbox.$inferSelect & {
  region: typeof regions.$inferSelect | null;
};

export async function getAllHyroxBoxes(params?: {
  regionId?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { regionId, search, page = 1, limit = 50 } = params || {};
  const offset = (page - 1) * limit;

  let query = db
    .select({
      id: hyroxbox.id,
      name: hyroxbox.name,
      description: hyroxbox.description,
      address: hyroxbox.address,
      contactInfo: hyroxbox.contactInfo,
      instagramId: hyroxbox.instagramId,
      price: hyroxbox.price,
      nonMemberPrice: hyroxbox.nonMemberPrice,
      popularity: hyroxbox.popularity,
      features: hyroxbox.features,
      naverMapUrl: hyroxbox.naverMapUrl,
      regionId: hyroxbox.regionId,
      createdAt: hyroxbox.createdAt,
      updatedAt: hyroxbox.updatedAt,
      region: regions,
    })
    .from(hyroxbox)
    .leftJoin(regions, eq(hyroxbox.regionId, regions.id))
    .orderBy(desc(hyroxbox.popularity))
    .$dynamic();

  if (regionId) {
    query = query.where(eq(hyroxbox.regionId, regionId));
  }

  if (search) {
    query = query.where(
      or(
        like(hyroxbox.name, `%${search}%`),
        like(hyroxbox.address, `%${search}%`),
        like(hyroxbox.features, `%${search}%`)
      )
    );
  }

  const data = await query.limit(limit).offset(offset);

  return data as HyroxBoxWithRegion[];
}

export async function getHyroxBoxById(id: number) {
  const data = await db
    .select({
      id: hyroxbox.id,
      name: hyroxbox.name,
      description: hyroxbox.description,
      address: hyroxbox.address,
      contactInfo: hyroxbox.contactInfo,
      instagramId: hyroxbox.instagramId,
      price: hyroxbox.price,
      nonMemberPrice: hyroxbox.nonMemberPrice,
      popularity: hyroxbox.popularity,
      features: hyroxbox.features,
      naverMapUrl: hyroxbox.naverMapUrl,
      regionId: hyroxbox.regionId,
      createdAt: hyroxbox.createdAt,
      updatedAt: hyroxbox.updatedAt,
      region: regions,
    })
    .from(hyroxbox)
    .leftJoin(regions, eq(hyroxbox.regionId, regions.id))
    .where(eq(hyroxbox.id, id))
    .limit(1);

  return data[0] as HyroxBoxWithRegion | undefined;
}

export async function createHyroxBox(
  data: typeof hyroxbox.$inferInsert
): Promise<typeof hyroxbox.$inferSelect> {
  // Validate region exists
  const region = await db
    .select()
    .from(regions)
    .where(eq(regions.id, data.regionId))
    .limit(1);

  if (!region.length) {
    throw new Error("Region not found");
  }

  const [newHyroxBox] = await db
    .insert(hyroxbox)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/hyroxbox");

  return newHyroxBox;
}

export async function updateHyroxBox(
  id: number,
  data: Partial<typeof hyroxbox.$inferInsert>
): Promise<typeof hyroxbox.$inferSelect> {
  // Check if exists
  const existing = await db
    .select()
    .from(hyroxbox)
    .where(eq(hyroxbox.id, id))
    .limit(1);

  if (!existing.length) {
    throw new Error("HyroxBox not found");
  }

  // Validate region if provided
  if (data.regionId) {
    const region = await db
      .select()
      .from(regions)
      .where(eq(regions.id, data.regionId))
      .limit(1);

    if (!region.length) {
      throw new Error("Region not found");
    }
  }

  const [updated] = await db
    .update(hyroxbox)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(hyroxbox.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/hyroxbox");

  return updated;
}

export async function deleteHyroxBox(id: number): Promise<void> {
  const existing = await db
    .select()
    .from(hyroxbox)
    .where(eq(hyroxbox.id, id))
    .limit(1);

  if (!existing.length) {
    throw new Error("HyroxBox not found");
  }

  await db.delete(hyroxbox).where(eq(hyroxbox.id, id));

  revalidatePath("/");
  revalidatePath("/admin/hyroxbox");
}

export async function getHyroxBoxCount(regionId?: number): Promise<number> {
  let query = db
    .select({ count: sql<number>`count(*)` })
    .from(hyroxbox)
    .$dynamic();

  if (regionId) {
    query = query.where(eq(hyroxbox.regionId, regionId));
  }

  const result = await query;
  return Number(result[0]?.count || 0);
}
