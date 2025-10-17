"use server";

import { db } from "@/db";
import { regions, hyroxbox } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type RegionWithCount = typeof regions.$inferSelect & {
  hyroxboxCount: number;
};

export async function getAllRegions() {
  const data = await db
    .select()
    .from(regions)
    .orderBy(regions.name);

  return data;
}

export async function getRegionById(id: number) {
  const data = await db
    .select()
    .from(regions)
    .where(eq(regions.id, id))
    .limit(1);

  return data[0];
}

export async function getRegionsWithCount(): Promise<RegionWithCount[]> {
  const data = await db
    .select({
      id: regions.id,
      name: regions.name,
      code: regions.code,
      description: regions.description,
      createdAt: regions.createdAt,
      updatedAt: regions.updatedAt,
      hyroxboxCount: sql<number>`cast(count(${hyroxbox.id}) as integer)`,
    })
    .from(regions)
    .leftJoin(hyroxbox, eq(regions.id, hyroxbox.regionId))
    .groupBy(regions.id)
    .orderBy(regions.name);

  return data;
}

export async function createRegion(
  data: typeof regions.$inferInsert
): Promise<typeof regions.$inferSelect> {
  // Check if code already exists
  const existing = await db
    .select()
    .from(regions)
    .where(eq(regions.code, data.code))
    .limit(1);

  if (existing.length) {
    throw new Error("Region code already exists");
  }

  const [newRegion] = await db
    .insert(regions)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/region");

  return newRegion;
}

export async function updateRegion(
  id: number,
  data: Partial<typeof regions.$inferInsert>
): Promise<typeof regions.$inferSelect> {
  // Check if exists
  const existing = await db
    .select()
    .from(regions)
    .where(eq(regions.id, id))
    .limit(1);

  if (!existing.length) {
    throw new Error("Region not found");
  }

  // Check if code is being changed and if new code already exists
  if (data.code && data.code !== existing[0].code) {
    const codeExists = await db
      .select()
      .from(regions)
      .where(eq(regions.code, data.code))
      .limit(1);

    if (codeExists.length) {
      throw new Error("Region code already exists");
    }
  }

  const [updated] = await db
    .update(regions)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(regions.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/region");

  return updated;
}

export async function deleteRegion(id: number): Promise<void> {
  // Check if exists
  const existing = await db
    .select()
    .from(regions)
    .where(eq(regions.id, id))
    .limit(1);

  if (!existing.length) {
    throw new Error("Region not found");
  }

  // Check for associated HyroxBoxes
  const associatedBoxes = await db
    .select()
    .from(hyroxbox)
    .where(eq(hyroxbox.regionId, id))
    .limit(1);

  if (associatedBoxes.length) {
    throw new Error(
      "Cannot delete region with associated HyroxBoxes. Please delete or reassign them first."
    );
  }

  await db.delete(regions).where(eq(regions.id, id));

  revalidatePath("/");
  revalidatePath("/admin/region");
}

export async function getRegionCount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(regions);

  return Number(result[0]?.count || 0);
}
