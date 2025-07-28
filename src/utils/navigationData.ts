// auto-generated navigation data - do not edit manually
// run 'node scripts/generateNavigationData.mjs' to regenerate

export const navigationData = [
  {
    name: "Burger",
    slug: "burger",
    years: [2025, 2024, 2023, 2019],
  },
  {
    name: "Nacho",
    slug: "nacho",
    years: [2025, 2023, 2019],
  },
  {
    name: "Pizza",
    slug: "pizza",
    years: [2025, 2024],
  },
  {
    name: "Sandwich",
    slug: "sandwich",
    years: [2025, 2024, 2022],
  },
  {
    name: "Taco",
    slug: "taco",
    years: [2025],
  },
  {
    name: "Wing",
    slug: "wing",
    years: [2024],
  },
];

export function getNavigationData() {
  return navigationData;
}

export function getYearsForFoodType(foodType: string): number[] {
  const data = navigationData.find(item => item.slug === foodType);
  return data?.years || [];
}
