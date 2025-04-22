import React from "react";
import { redirect } from "next/navigation";

import constants from "@/settings/constants";
import { customFetch } from "@/utils/custom-fetch";
type Params = Promise<{ id: string }>;
const getCompetitionId = async (id: string) => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/competitions/${id}`,
  );

  if (!data) {
    return null;
  }

  return data;
};

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const data = await getCompetitionId(id);

  if (!data) redirect("/");
  else redirect(`/cuoc-thi/${data?.slug}`);

  return <div>page</div>;
};

export default page;
