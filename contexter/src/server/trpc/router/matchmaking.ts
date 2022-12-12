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
    if (profile === null) {
        return { error: "User profile not found", success: null};
    } else {
        const gender = profile.gender ? profile.gender : "male";
        await client.zAdd(gender, [{score: Date.now(), value: JSON.stringify({username: user.id})}]);
        return { success: "User added to queue", error: null};
    }
  }),
});
