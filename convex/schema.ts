import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  projects: defineTable({
    name: v.string(),
    start: v.number(),
    count: v.number(),
  }),
  selections: defineTable({
    projects_id: v.id("projects"),
    name: v.string(),
    position: v.number(),
  }).index("by_pr", ["projects_id"]),
});
