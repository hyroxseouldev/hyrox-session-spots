import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Regions 테이블 (지역 카테고리, 필터링용)
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  regionName: varchar("region_name", { length: 255 }).unique().notNull(), // 예: "서울 강남"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hyroxbox 테이블
export const hyroxbox = pgTable("hyroxbox", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // 이름
  address: text("address").notNull(), // 주소
  instagramId: varchar("instagram_id", { length: 255 }), // 인스타 아이디
  price: integer("price").notNull(), // 가격 (예: 원 단위)
  features: text("features"), // 특징 (텍스트 또는 JSON으로 확장 가능, 예: "피트니스, 요가")
  naverMapUrl: varchar("naver_map_url", { length: 512 }), // 네이버 맵 주소 (URL)
  regionId: integer("region_id")
    .references(() => regions.id)
    .unique(), // 1:1 관계 FK (unique로 1:1 보장)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 관계 정의 (쿼리 시 사용, One-to-One)
export const regionsRelations = relations(regions, ({ one }) => ({
  hyroxbox: one(hyroxbox, {
    fields: [regions.id],
    references: [hyroxbox.regionId],
  }),
}));

export const hyroxboxRelations = relations(hyroxbox, ({ one }) => ({
  region: one(regions, {
    fields: [hyroxbox.regionId],
    references: [regions.id],
  }),
}));
