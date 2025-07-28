import { defineCollection, z } from "astro:content";

const events = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    dateStart: z.string(),
    dateEnd: z.string(),
    url: z.string(),
    type: z.enum(["burger", "nacho", "pizza", "sandwich", "wing", "taco"]),
    year: z.number(),
    ogImage: z.string().optional(),
    organizer: z.object({
      name: z.string(),
      description: z.string(),
      url: z.string(),
      logo: z.string(),
    }),
  }),
});

const food = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      location: z.string(),
      locationUrl: z.string().nullable(),
      neighborhood: z.array(z.string()),
      description: z.string(),
      hours: z.string(),
      imageUrl: z.string(),
      diet: z.array(z.enum(["gf", "vegetarian", "vegan", "meat"])),
      type: z.enum(["burger", "nacho", "pizza", "sandwich", "wing", "taco"]),
      year: z.number(),
    })
  ),
});

export const collections = {
  events,
  food,
};
