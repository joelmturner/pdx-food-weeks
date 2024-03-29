import { Food, db } from 'astro:db';
import Sando2024 from 'content/sandwiches/2024.json';
import Sando2022 from 'content/sandwiches/2022.json';
import Nacho2019 from 'content/nachos/2019.json';
import Nacho2023 from 'content/nachos/2023.json';
import Burger2019 from 'content/burgers/2019.json';
import Burger2023 from 'content/burgers/2023.json';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Food).values(Sando2022.map(({id, ...item}) => ({ ...item, year: 2022, type: 'sandwich' })));
    await db.insert(Food).values(Sando2024.map(({id, ...item}) => ({ ...item, year: 2024, type: 'sandwich' })));
    await db.insert(Food).values(Nacho2019.map(({id, ...item}) => ({ ...item, year: 2019, type: 'nacho' })));
    await db.insert(Food).values(Nacho2023.map(({id, ...item}) => ({ ...item, year: 2023, type: 'nacho' })));
    await db.insert(Food).values(Burger2019.map(({id, ...item}) => ({ ...item, year: 2019, type: 'burger' })));
    await db.insert(Food).values(Burger2023.map(({id, ...item}) => ({ ...item, year: 2023, type: 'burger' })));
}
