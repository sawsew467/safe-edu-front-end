import React from "react";

import FormAddNewOrganizations from "@/features/organizations/components/form-add-new-organizations";

const AddOrganizations = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <FormAddNewOrganizations />
    </div>
  );
};

export default AddOrganizations;
