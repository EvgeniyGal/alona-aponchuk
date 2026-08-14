import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  organization: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  role: z.string().trim().max(200).optional().default(""),
  orgType: z.string().trim().min(1).max(120),
  crm: z.string().trim().max(200).optional().default(""),
  scheduling: z.string().trim().max(200).optional().default(""),
  ai: z.string().trim().max(200).optional().default(""),
  forms: z.string().trim().max(200).optional().default(""),
  messaging: z.string().trim().max(200).optional().default(""),
  problem: z.string().trim().min(1).max(120),
  leads: z.string().trim().max(20).optional().default(""),
  consults: z.string().trim().max(20).optional().default(""),
  clients: z.string().trim().max(20).optional().default(""),
  staff: z.string().trim().max(20).optional().default(""),
  lost: z.string().trim().max(4000).optional().default(""),
  followup: z.string().trim().max(4000).optional().default(""),
  afterForm: z.string().trim().max(4000).optional().default(""),
  improve: z.string().trim().max(4000).optional().default(""),
});

export type ContactPayload = z.infer<typeof contactSchema>;
