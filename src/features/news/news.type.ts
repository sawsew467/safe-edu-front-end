export type TypeNews = {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  isActive: boolean;
  topic_id: string;
};

export type TypeAddNewNews = {
  topic_id: string;
  title: string;
  content: string;
  image: string;
  author: string;
};
export type TypeUpdateNews = {
  params: {
    id: string;
  };
  body: TypeAddNewNews;
};
