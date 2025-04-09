import React from "react";

import CompetitionsModule from "@/features/competitions/components/CompetitionsModule";

const Competitions = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <CompetitionsModule />
    </div>
  );
};

export default Competitions;
