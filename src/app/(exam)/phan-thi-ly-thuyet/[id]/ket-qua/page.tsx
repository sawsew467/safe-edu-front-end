import QuizResults from "@/features/competitions/components/quizz/quizz-result";
import { QuizResultQuestion } from "@/features/competitions/type.competitions";
import constants from "@/settings/constants";
import { customFetch } from "@/utils/custom-fetch";
type Params = Promise<{ id: string }>;
const getQuizResults = async (id: string) => {
  const data = await customFetch(`${constants.API_SERVER}/quiz-result/${id}`);

  if (data?.statusCode === 401) return null;

  return data?.data;
};

const getUserProfile = async () => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/Students/get-profile/user`,
  );

  if (!data) return;
  const { avatar, first_name, last_name, username } = data;

  return { avatar, first_name, last_name, username };
};

export default async function Home({ params }: { params: Params }) {
  const { id } = await params;
  const data: QuizResultQuestion = await getQuizResults(id);
  const user = await getUserProfile();

  console.log("data", data);

  return (
    <main className="container mx-auto py-8 px-4">
      <QuizResults quizData={data} user={user} />
    </main>
  );
}
