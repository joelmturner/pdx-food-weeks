import type socialIcons from "@assets/socialIcons";
import { FOOD_TYPES } from "./constants";

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  scheduledPostMargin: number;
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type FoodItem = {
  id: string;
  description: string;
  title: string;
  url: string;
  location: string;
  locationUrl: string;
  hours: string;
  diet: ("gf" | "vegetarian" | "vegan" | "meat")[];
  imageUrl: string;
  neighborhood: string[];
  year: number;
  type: FoodType;
};

export type EventsItem = {
  id: string;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  url: string;
  type: FoodType;
  year: number;
  ogImage?: string;
  organizer: {
    name: string;
    description: string;
    url: string;
    logo: string;
  };
};

export type ListItem = {
  id: number;
  name?: string;
  foodIds: number[];
  userId: string;
};

export type FoodType = (typeof FOOD_TYPES)[number];
