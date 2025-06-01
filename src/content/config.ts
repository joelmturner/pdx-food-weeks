import { defineCollection, z } from "astro:content";
import { FOOD_TYPES } from "../constants";

const food = defineCollection({
  type: "data",
  schema: () => z.array(foodDataItem),
});

const foodDataItem = z.object({
  id: z.string(),
  description: z.string(),
  title: z.string(),
  url: z.string().url(),
  location: z.string(),
  locationUrl: z.string(),
  hours: z.string(),
  diet: z.array(z.enum(["gf", "vegetarian", "vegan", "meat"])),
  imageUrl: z.string().url(),
  neighborhood: z.array(z.string()),
  year: z.string(),
  type: z.enum(FOOD_TYPES),
});

export const collections = { food };
