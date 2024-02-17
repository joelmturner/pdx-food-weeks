import { defineCollection, z } from "astro:content";

const burgers = defineCollection({
  type: "data",
  schema: () =>
  z.array(foodDataItem)
});

const nachos = defineCollection({
  type: "data",
  schema: () =>
  z.array(foodDataItem)
});

const sandwiches = defineCollection({
  type: "data",
  schema: () =>
  z.array(foodDataItem)
});

const foodDataItem = z.object({
    id: z.string(),
    description: z.string(),
    title: z.string(),
    url: z.string().url(),
    location: z.string(),
    locationUrl: z.string(),
    hours: z.string(),
    diet: z.array(z.enum(['gf', 'vegetarian', 'vegan', 'meat'])),
    imageUrl: z.string().url(),
    neighborhood: z.array(z.string()),
})

export const collections = { burgers, nachos, sandwiches };
