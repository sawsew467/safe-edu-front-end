import React, { use } from "react";

const UpdateAdminManagement = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);

  return <div>UpdateAdminManagement</div>;
};

export default UpdateAdminManagement;
