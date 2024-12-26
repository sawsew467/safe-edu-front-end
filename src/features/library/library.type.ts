export type Library = {
  _id: string;
  category_name: string;
  image_url: any;
  description: string;
  topic_id: string;
  isActive: boolean;
};

export type TypeAddNewLibrary = {
  category_name: string;
  topic_id: string;
  description: string;
  image: string;
};
export type TypeUpdateLibrary = {
  params: {
    id: string;
  };
  body: {
    category_name: string;
    topic_id: string;
    description: string;
    image: string;
  };
};

export type TypeTitlePage = {
  title: string;
  href: string;
  contentHref: string;
};
