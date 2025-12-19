import { createTRPCRouter } from "../trpc";
import { projectsRouter } from "./projects";
import { updatesRouter } from "./updates";
import { decisionsRouter } from "./decisions";
import { risksRouter } from "./risks";
import { searchRouter } from "./search";
import { billingRouter } from "./billing";
import { settingsRouter } from "./settings";

/**
 * Router principal tRPC
 * Combine tous les sous-routers de l'application
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  updates: updatesRouter,
  decisions: decisionsRouter,
  risks: risksRouter,
  search: searchRouter,
  billing: billingRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
