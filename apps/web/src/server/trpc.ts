import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@ascendos/database";

/**
 * Contexte tRPC
 * Contient la DB et l'authentification Clerk
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId, orgId } = await auth();

  return {
    db,
    userId,
    orgId,
    ...opts,
  };
};

/**
 * Initialisation tRPC avec SuperJSON pour la sérialisation
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Router builder
 */
export const createTRPCRouter = t.router;

/**
 * Procédure publique (pas d'auth requise)
 */
export const publicProcedure = t.procedure;

/**
 * Procédure protégée (auth requise)
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // userId et orgId sont maintenant garantis non-null
      db: ctx.db,
      userId: ctx.userId,
      orgId: ctx.orgId,
    },
  });
});
