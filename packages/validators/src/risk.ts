import { z } from 'zod';

export const createRiskSchema = z.object({
  projectId: z.string().cuid(),
  description: z.string().min(1, 'La description est requise'),
  impact: z.string().min(1, 'L\'impact est requis'),
  mitigation: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  reviewDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateRiskSchema = z.object({
  description: z.string().min(1).optional(),
  impact: z.string().min(1).optional(),
  mitigation: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['OPEN', 'MONITORING', 'MITIGATED', 'RESOLVED', 'CANCELLED']).optional(),
  reviewDate: z.date().optional(),
  resolvedAt: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const listRisksSchema = z.object({
  projectId: z.string().cuid(),
  status: z.array(z.enum(['OPEN', 'MONITORING', 'MITIGATED', 'RESOLVED', 'CANCELLED'])).optional(),
  severity: z.array(z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export type CreateRiskInput = z.infer<typeof createRiskSchema>;
export type UpdateRiskInput = z.infer<typeof updateRiskSchema>;
export type ListRisksInput = z.infer<typeof listRisksSchema>;
