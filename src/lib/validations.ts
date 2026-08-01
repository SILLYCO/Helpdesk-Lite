import { z } from "zod"
import { CATEGORIES, PRIORITIES } from "@/lib/constants"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const submitTicketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be 120 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be 2000 characters or less"),
  category: z.enum(CATEGORIES, { required_error: "Please select a category" }),
  priority: z.enum(PRIORITIES),
})

export type SubmitTicketFormValues = z.infer<typeof submitTicketSchema>

export const commentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be 1000 characters or less"),
})

export type CommentFormValues = z.infer<typeof commentSchema>
