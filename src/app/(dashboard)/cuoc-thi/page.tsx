import React from "react";

import TitlePage from "@/components/ui/title-page";
import CompetitionsModule from "@/features/competitions/components/CompetitionsModule";

const Competitions = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        contentHref="Thêm Cuộc thi"
        href="cuoc-thi/them-cuoc-thi"
        title="Quản lí cuộc thi"
      />
      <CompetitionsModule />
    </div>
  );
};

export default Competitions;
