export type Library = {
  id: string;
  slug: string;
  title: string;
  icon: any;
  subtitle: Array<{
    id: string;
    title: string;
    content: Array<string>;
    image: Array<any>;
    imageDescription: Array<string>;
  }>;
};

export type TypeTitleLibrary = {
  title: string;
  href: string;
  contentHref: string;
};
