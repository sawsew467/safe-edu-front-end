import React, { use } from "react";

import AdminProfileModule from "@/features/users/components/admin-profile";
const AdminProfile = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <AdminProfileModule id={id} />
    </div>
  );
};

export default AdminProfile;
