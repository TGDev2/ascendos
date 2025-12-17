import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis').max(100),
  description: z.string().optional(),
  masterProfileId: z.string().cuid(),
  objectives: z.array(z.string()).default([]),
  sponsorName: z.string().optional(),
  sponsorRole: z.string().optional(),
  sponsorEmail: z.string().email().optional().or(z.literal('')),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
