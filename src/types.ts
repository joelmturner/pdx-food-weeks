export type CardData = {
  id: string;
  description: string;
  title: string;
  url: string;
  location: string;
  locationUrl: string;
  hours: string;
  diet: string[];
  imageUrl: string;
  neighborhood: string[];
};

export type PageResults = {
  id: number;
  name: string;
  url: string;
  venue: string;
  venueUrl: string | null;
  neighborhood: string | null;
  date: string;
  mapUrl: string | null;
  ingredients: string;
  description: string;
  times: string;
  info: string;
  imageUrl: string | null;
};
