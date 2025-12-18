import { z } from 'zod';

export const createDecisionSchema = z.object({
  projectId: z.string().cuid(),
  description: z.string().min(1, 'La description est requise'),
  context: z.string().optional(),
  decidedBy: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateDecisionSchema = z.object({
  description: z.string().min(1).optional(),
  context: z.string().optional(),
  outcome: z.string().optional(),
  decidedBy: z.string().optional(),
  decidedAt: z.date().optional(),
  status: z.enum(['PENDING', 'DECIDED', 'CANCELLED']).optional(),
  tags: z.array(z.string()).optional(),
});

export const listDecisionsSchema = z.object({
  projectId: z.string().cuid(),
  status: z.array(z.enum(['PENDING', 'DECIDED', 'CANCELLED'])).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;
export type UpdateDecisionInput = z.infer<typeof updateDecisionSchema>;
export type ListDecisionsInput = z.infer<typeof listDecisionsSchema>;
