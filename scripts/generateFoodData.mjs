import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFoodData() {
  try {
    const contentDir = path.join(__dirname, '../src/content/food');
    const foodTypes = await fs.readdir(contentDir);
    
    const foodData = {};
    
    for (const type of foodTypes) {
      const typeDir = path.join(contentDir, type);
      const files = await fs.readdir(typeDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      foodData[type] = {};
      
      for (const file of jsonFiles) {
        const year = file.split('.')[0];
        const filePath = path.join(typeDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        // clean the data to match FoodItem type
        const cleanedData = data.map(item => {
          // remove date property if it exists
          const { date, mapUrl, ...itemWithoutDate } = item;
          
          // fix locationUrl if it's null
          if (itemWithoutDate.locationUrl === null) {
            itemWithoutDate.locationUrl = '';
          }
          
          // fix diet array - remove trailing commas and ensure valid values
          if (itemWithoutDate.diet) {
            itemWithoutDate.diet = itemWithoutDate.diet
              .map(diet => diet.replace(',', '').trim())
              .filter(diet => ['gf', 'vegetarian', 'vegan', 'meat'].includes(diet));
          }
          
          return itemWithoutDate;
        });
        
        foodData[type][year] = cleanedData;
      }
    }
    
    // generate the TypeScript file content
    const fileContent = `// auto-generated food data - do not edit manually
// run 'node scripts/generateFoodData.mjs' to regenerate

import type { FoodItem } from "../types";

export const foodData: Record<string, Record<string, FoodItem[]>> = ${JSON.stringify(foodData, null, 2)};

export function getFoodItems(year: number, type: string): FoodItem[] {
  const typeData = foodData[type];
  if (!typeData) return [];
  
  const yearData = typeData[year];
  if (!yearData) return [];
  
  return yearData.filter((item: FoodItem) => item.year === year && item.type === type);
}

export function getFoodItemById(id: string): FoodItem | undefined {
  for (const type in foodData) {
    for (const year in foodData[type]) {
      const item = foodData[type][year].find((item: FoodItem) => item.id === id);
      if (item) return item;
    }
  }
  return undefined;
}

export function getFoodItemsByIds(ids: string[]): FoodItem[] {
  const items: FoodItem[] = [];
  for (const id of ids) {
    const item = getFoodItemById(id);
    if (item) items.push(item);
  }
  return items;
}
`;

    // write to the food data file
    const outputPath = path.join(__dirname, '../src/utils/foodData.ts');
    await fs.writeFile(outputPath, fileContent);
    
    console.log('✅ Food data generated successfully!');
    console.log('Generated data for types:', Object.keys(foodData));
    console.log('Years available:', Object.fromEntries(
      Object.entries(foodData).map(([type, years]) => [type, Object.keys(years)])
    ));
  } catch (error) {
    console.error('❌ Error generating food data:', error);
    process.exit(1);
  }
}

generateFoodData(); 