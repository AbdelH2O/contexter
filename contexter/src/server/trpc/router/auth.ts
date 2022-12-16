import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import Peronalities from "../../../enums/personalities";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  setUsername: protectedProcedure
    .input(z.object({name: z.string(), gender: z.string(), personality: z.nativeEnum(Peronalities)}))
    .mutation(({ ctx, input }) => {
      // console.log(ctx.session);
      
      const resp = ctx.prisma.user.update({
        where: { email: ctx.session.user.email! },
        data: {
          name: input.name,
          gender: input.gender,
          personality: input.personality,
        },
      });
      console.log(resp);
      return resp;
    }),
});
