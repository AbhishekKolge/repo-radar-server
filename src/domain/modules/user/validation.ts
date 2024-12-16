import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

export const verifyEmailSchema = z.object({
  body: z.object({
    code: z
      .string()
      .trim()
      .length(6, {
        message: 'Code must be exactly 6 digits',
      })
      .regex(/^\d+$/, { message: 'Code must only contain numbers' }),
  }),
});

export const removeProfileImageSchema = z.object({
  query: z.object({
    imageId: z.string().trim().min(1, {
      message: 'Image ID is required',
    }),
  }),
});

export const zContactNumber = z
  .string()
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value) return true;
      const phoneNumber = parsePhoneNumberFromString(value, {
        extract: false,
        defaultCountry: 'IN',
      });
      return phoneNumber ? phoneNumber.isValid() : false;
    },
    {
      message: 'Contact number is not valid',
    },
  );

export const updateProfileSchema = z.object({
  input: z
    .object({
      name: z
        .string()
        .trim()
        .max(50, {
          message: 'Max 50 characters allowed',
        })
        .min(1, {
          message: 'Min 1 character required',
        })
        .optional()
        .nullable(),
      email: z.string().trim().email('Invalid email').optional().nullable(),
      dob: z.string().trim().datetime({ offset: true }).optional().nullable(),
      contactNumber: zContactNumber,
      contactCountryId: z.string().trim().optional().nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.contactNumber && !data.contactCountryId) {
        ctx.addIssue({
          code: 'custom',
          path: ['contactCountryId'],
          message: 'Required if contact number is provided',
        });
      }
      if (!data.contactNumber && data.contactCountryId) {
        ctx.addIssue({
          code: 'custom',
          path: ['contactNumber'],
          message: 'Required if country is provided',
        });
      }
    }),
});
