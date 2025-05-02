import React from "react";

import ProfilePage from "@/features/users/components/student/profile-student";
import { customFetch } from "@/utils/custom-fetch";
import constants from "@/settings/constants";

const getProfileUser = async (username: string) => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/students/username/${username}`,
  );

  return data;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { username } = await params;
  const profile = await getProfileUser(username);

  return {
    title: `${profile?.first_name} ${profile?.last_name}`,
    description: `${profile?.first_name} ${profile?.last_name} đang tham gia SafeEdu, SafeEdu là nền tảng nâng cao nhận thức xã hội với các tài nguyên giáo dục về bình đẳng giới, phòng chống ma túy và bạo lực học đường.`,
  };
}

type Params = Promise<{ username: string }>;

const ProfileUser = () => {
  return <ProfilePage />;
};

export default ProfileUser;
