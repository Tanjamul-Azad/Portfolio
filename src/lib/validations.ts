import { z } from "zod";

// Kept in sync with the server-side schema in src/app/api/contact/route.ts.
// They previously disagreed on maximum lengths, so an over-long message passed
// client validation and then failed on the server with a raw error toast.
export const NAME_MAX = 100;
export const MESSAGE_MAX = 5000;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(NAME_MAX, `Name must be under ${NAME_MAX} characters`),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "That email address is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(MESSAGE_MAX, `Message must be under ${MESSAGE_MAX} characters`),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
