import { column, defineDb, defineTable } from 'astro:db';

const Food = defineTable({
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
});

export const user = defineTable( {
    columns: {
        id: column.text({primaryKey: true, notNull: true, unique: true}),
        username: column.text(),
        password: column.text(),
        role: column.text(),
    }
} );

export const session = defineTable( {
    columns: {
        id: column.text({primaryKey: true, notNull: true}),
        userId: column.text(),
        expiresAt: column.number(),
    }
} );

// https://astro.build/db/config
export default defineDb( {
    tables: { Food, user, session}
} );
