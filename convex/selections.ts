import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const get = query({
  args: {
    project_id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("selections")
      .withIndex("by_pr")
      .filter((q) => q.eq(q.field("projects_id"), args.project_id))
      .collect();
  },
});

export const create = mutation({
  args: {
    project_id: v.id("projects"),
    name: v.string(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("selections", {
      projects_id: args.project_id,
      name: args.name,
      position: args.position,
    });
  },
});
