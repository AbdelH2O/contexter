import { router, protectedProcedure } from "../trpc";
import client from "../../../utils/redisClient";

export const matchmakingRouter = router({
  joinQueue: protectedProcedure.mutation(async ({ctx}) => {
    try {
        await client.connect();
    } catch (err) {
        console.log(err);
    }
    const { user } = ctx.session;
    const profile = await ctx.prisma.user.findUnique({
        where: { id: user.id },
    });
    console.log(profile);
    
    if (profile === null || profile.gender === null || profile.personality === null) {
        return { error: "User profile not found or profile not setup yet", success: null};
    } else {
        // const gender = profile.gender ? profile.gender : "male";
        const resp = await client.zAdd(profile.gender, [{score: Date.now()/1000, value: JSON.stringify({username: user.id, personality: profile.personality})}]);
        console.log(resp);
        
        return { success: "User added to queue", error: null};
    }
  }),
});
