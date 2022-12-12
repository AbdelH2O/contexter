import { router } from "../trpc";
import { authRouter } from "./auth";
import { matchmakingRouter } from "./matchmaking";

export const appRouter = router({
  auth: authRouter,
  matchmaking: matchmakingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
