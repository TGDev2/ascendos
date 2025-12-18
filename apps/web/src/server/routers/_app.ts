import { createTRPCRouter } from "../trpc";
import { projectsRouter } from "./projects";
import { updatesRouter } from "./updates";

/**
 * Router principal tRPC
 * Combine tous les sous-routers de l'application
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  updates: updatesRouter,
});

export type AppRouter = typeof appRouter;
