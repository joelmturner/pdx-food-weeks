import { column, defineDb, defineTable } from 'astro:db';

const foodDataItem = {
    columns: {
        id: column.number({primaryKey: true}),
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
        type: column.text(),
    }
};

const Food = defineTable( foodDataItem );

// https://astro.build/db/config
export default defineDb( {
    tables: { Food }
} );
