import React from "react";

import FormEditNewOrganizations from "@/features/organizations/components/form-edit-new-organizations";

const EditOrganizations = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <FormEditNewOrganizations />
    </div>
  );
};

export default EditOrganizations;
