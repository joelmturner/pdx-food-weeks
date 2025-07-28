import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateNavigationData() {
  try {
    const contentDir = path.join(__dirname, '../src/content/food');
    const foodTypes = await fs.readdir(contentDir);
    
    const navigationData = await Promise.all(
      foodTypes.map(async (type) => {
        const typeDir = path.join(contentDir, type);
        const files = await fs.readdir(typeDir);
        const years = files
          .filter(file => file.endsWith('.json'))
          .map(file => parseInt(file.split('.')[0]))
          .sort((a, b) => b - a); // sort descending
        
        return {
          name: type.charAt(0).toUpperCase() + type.slice(1),
          slug: type,
          years
        };
      })
    );
    
    // generate the TypeScript file content
    const fileContent = `// auto-generated navigation data - do not edit manually
// run 'node scripts/generateNavigationData.mjs' to regenerate

export const navigationData = ${JSON.stringify(navigationData, null, 2)};

export function getNavigationData() {
  return navigationData;
}

export function getYearsForFoodType(foodType: string): number[] {
  const data = navigationData.find(item => item.slug === foodType);
  return data?.years || [];
}
`;

    // write to the navigation data file
    const outputPath = path.join(__dirname, '../src/utils/navigationData.ts');
    await fs.writeFile(outputPath, fileContent);
    
    console.log('✅ Navigation data generated successfully!');
    console.log('Generated data:', navigationData);
  } catch (error) {
    console.error('❌ Error generating navigation data:', error);
    process.exit(1);
  }
}

generateNavigationData(); 