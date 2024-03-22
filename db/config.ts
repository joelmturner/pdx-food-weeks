import { column, defineDb, defineTable } from 'astro:db';

const foodDataItem = {columns: {
    id: column.text(),
    description: column.text(),
    title: column.text(),
    url: column.text(),
    location: column.text(),
    locationUrl: column.text(),
    hours: column.text(),
    diet: column.json(),
    imageUrl: column.text(),
    neighborhood: column.json(),
    year: column.number(),
}};

const Pizzas = defineTable(foodDataItem);
const Burgers = defineTable(foodDataItem);
const Nachos = defineTable(foodDataItem);
const Sandwiches = defineTable(foodDataItem);

// https://astro.build/db/config
export default defineDb({
  tables: { Pizzas, Burgers, Nachos, Sandwiches }
});
