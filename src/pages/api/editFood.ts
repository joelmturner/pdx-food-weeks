import type { APIContext } from "astro";
import { db, eq, Food } from 'astro:db';

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return new Response(null, {
			status: 401
		});
	}

    const formData = await context.request.formData();
    const updatedFoodItem: Record<string, string | string[]> = {};
    const id = parseInt(formData.get('id') as string);
	Array.from(formData).forEach(([key, value]) => {
        const resolvedKey = (key as string).split('_')[0];
        let resolvedValue: string | string[] = value as string;

        if (resolvedKey !== 'id') {
            if (['diet', 'neighborhood'].includes(resolvedKey)) {
                const split = (value as string).split(',')?.map((item) => item.trim());
                resolvedValue = Array.isArray(split) ? split : [split];
            }
            updatedFoodItem[resolvedKey] = typeof resolvedValue === 'string' ? resolvedValue.trim() : resolvedValue;
        }
    });

    const updateFoodItem = await db.update(Food).set(updatedFoodItem).where(eq(Food.id, id)).run();

    // else return an error response
    if (!updateFoodItem) {
        return new Response(null, {
            status: 400
        });
    }
	
	return new Response();
}