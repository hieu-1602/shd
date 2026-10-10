import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Bảng Invoices lưu trữ toàn bộ các bộ trang phục (Custom Outfits) được thiết kế và thêm lên
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  creatorName: text('creator_name'),
  gender: text('gender'),
  imageUrl: text('image_url'),
  imageUrls: jsonb('image_urls').$type<string[]>(),
  heroColor: text('hero_color'),
  colorLabel: text('color_label'),
  material: text('material'),
  era: text('era'),
  region: text('region'),
  introduction: text('introduction'),
  occasion: text('occasion'),
  components: jsonb('components').$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bảng Costumes lưu các món trang phục riêng lẻ đã thêm
export const costumes = pgTable('costumes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  era: text('era'),
  region: text('region'),
  gender: text('gender'),
  heroColor: text('hero_color'),
  colorLabel: text('color_label'),
  secondaryColor: text('secondary_color'),
  material: text('material'),
  originStory: text('origin_story'),
  culturalMeaning: text('cultural_meaning'),
  remixTips: text('remix_tips'),
  culturalAdvisory: text('cultural_advisory'),
  imageUrl: text('image_url'),
  imageUrls: jsonb('image_urls').$type<string[]>(),
  accentPattern: text('accent_pattern'),
  suitableOccasions: jsonb('suitable_occasions').$type<string[]>(),
  creatorName: text('creator_name'),
  createdAt: timestamp('created_at').defaultNow(),
});
