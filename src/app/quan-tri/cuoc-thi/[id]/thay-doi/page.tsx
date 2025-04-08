import React from "react";

import TitlePage from "@/components/ui/title-page";
import UpdateCompetitions from "@/features/competitions/components/form-update-new-competition";

const addCompetitionsPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Thay đổi cuộc thi" />
      <UpdateCompetitions />
    </div>
  );
};

export default addCompetitionsPage;
