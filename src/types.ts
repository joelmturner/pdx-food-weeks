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
  name: string;
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
