import { defineCollection, z } from "astro:content";
import { FOOD_TYPES } from "../constants";

const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  dateStart: z.string(),
  dateEnd: z.string(),
  url: z.string(),
  type: z.enum(FOOD_TYPES),
  year: z.number(),
  ogImage: z.string().optional(),
  mapUrl: z.string().optional(),
  organizer: z
    .number()
    .refine(val => val > 0, {
      message: "organizer must reference a valid organizer id",
    })
    .describe("references organizerSchema.id"),
});

const events = defineCollection({
  type: "data",
  schema: z.array(eventSchema),
});

const foodSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  location: z.string(),
  locationUrl: z.string().nullable(),
  neighborhood: z.array(z.string()),
  description: z.string(),
  hours: z.string(),
  imageUrl: z.string(),
  mapUrl: z.string().nullable().optional(),
  diet: z.array(z.enum(["gf", "vegetarian", "vegan", "meat"])),
  type: z.enum(FOOD_TYPES),
  year: z.number(),
});

const food = defineCollection({
  type: "data",
  schema: z.array(foodSchema),
});

const organizerSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  url: z.string(),
  logo: z.string(),
});

const organizer = defineCollection({
  type: "data",
  schema: organizerSchema,
});

export const collections = {
  events,
  food,
  organizer,
};

export type Events = z.infer<z.ZodArray<typeof eventSchema>>;
export type EventItem = z.infer<typeof eventSchema>;
export type FoodItems = z.infer<z.ZodArray<typeof foodSchema>>;
export type FoodItem = z.infer<typeof foodSchema>;
export type Organizer = z.infer<typeof organizerSchema>;
