import { z } from 'zod';
import { BaseEntity, emailSchema, nameSchema } from './common';

// RSVP validation schemas
export const rsvpFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  attendance: z.enum(['yes', 'no', 'maybe']).refine(val => val, {
    message: 'Please select your attendance status'
  }),
  dietary: z.string().max(500, 'Dietary restrictions must be less than 500 characters').optional(),
  plusOne: z.boolean().default(false),
  plusOneName: nameSchema.optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
});

export const rsvpUpdateSchema = rsvpFormSchema.partial();

// RSVP types
export type RSVPFormData = z.infer<typeof rsvpFormSchema>;
export type RSVPUpdateData = z.infer<typeof rsvpUpdateSchema>;

export interface RSVP extends BaseEntity {
  name: string;
  email: string;
  attendance: 'yes' | 'no' | 'maybe';
  dietary?: string;
  plusOne: boolean;
  plusOneName?: string;
  message?: string;
  submittedAt: Date;
}

export interface RSVPSummary {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  plusOnes: number;
}