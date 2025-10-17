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
  name: varchar("name", { length: 50 }).notNull(), // Region 이름
  code: varchar("code", { length: 10 }).unique().notNull(), // Region 코드 (예: "SEL", "BUS")
  description: text("description"), // 설명
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Hyroxbox 테이블 (Region과 Many-to-One 관계로 변경)
export const hyroxbox = pgTable("hyroxbox", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // 이름
  description: text("description"), // 설명
  address: text("address"), // 주소
  contactInfo: varchar("contact_info", { length: 100 }), // 연락처 정보
  instagramId: varchar("instagram_id", { length: 255 }), // 인스타 아이디
  price: integer("price"), // 회원 가격 (원 단위)
  nonMemberPrice: integer("non_member_price"), // 비회원 가격 (원 단위)
  popularity: integer("popularity").default(0).notNull(), // 인기도 (높을수록 인기)
  features: text("features"), // 특징 (예: "피트니스, 요가")
  naverMapUrl: varchar("naver_map_url", { length: 512 }), // 네이버 맵 주소
  regionId: integer("region_id")
    .references(() => regions.id)
    .notNull(), // Many-to-One 관계 FK (unique 제거)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 관계 정의 (쿼리 시 사용, Many-to-One)
export const regionsRelations = relations(regions, ({ many }) => ({
  hyroxboxes: many(hyroxbox),
}));

export const hyroxboxRelations = relations(hyroxbox, ({ one }) => ({
  region: one(regions, {
    fields: [hyroxbox.regionId],
    references: [regions.id],
  }),
}));
