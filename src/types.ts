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

export type ListItem = {
  id: number;
  name?: string;
  foodIds: number[];
  userId: string;
};

export type FoodType = (typeof FOOD_TYPES)[number];
