import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: { name: v.string(), start: v.number(), count: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("projects", {
      name: args.name,
      start: args.start,
      count: args.count,
    });
  },
});
