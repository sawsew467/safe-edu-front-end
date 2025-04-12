import React from "react";

import AddNewCompetitions from "@/features/competitions/components/form-add-new-competition";
import TitlePage from "@/components/ui/title-page";

const addCompetitionsPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Thêm cuộc thi mới" />
      <AddNewCompetitions />
    </div>
  );
};

export default addCompetitionsPage;
