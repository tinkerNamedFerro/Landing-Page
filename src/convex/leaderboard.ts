import { query, mutation } from "./_generated/server";

// easy helper for the client to append a single entry after a run
export const addEntry = mutation({
  // no explicit argument validators; accept any object and rely on client-side
  // code to pass correct shape
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("leaderboard", args);
  },
});

// simple read query returning every document in the collection; the client
// can sort/filter as needed.
export const getLeaderboard = query({
  handler: async (ctx: any) => {
    return await ctx.db.query("leaderboard").collect();
  },
});
