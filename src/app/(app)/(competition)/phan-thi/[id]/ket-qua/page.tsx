import QuizResults from "@/features/competitions/components/quizz/quizz-result";
import { QuizResultQuestion } from "@/features/competitions/type.competitions";
import constants from "@/settings/constants";
import { customFetch } from "@/utils/custom-fetch";
type Params = Promise<{ id: string }>;
const getQuizResults = async (id: string) => {
  const res = await customFetch(`${constants.API_SERVER}/quiz-result/${id}`);
  const { data } = await res.json();

  return data;
};

const getUserProfile = async (user_id: string) => {
  const res = await customFetch(`${constants.API_SERVER}/Students/${user_id}`);
  const { data } = await res.json();
  const { avatar, first_name, last_name, username } = data;

  return { avatar, first_name, last_name, username };
};

export default async function Home({ params }: { params: Params }) {
  const { id } = await params;
  const data: QuizResultQuestion = await getQuizResults(id);
  const user = await getUserProfile(data?.user_id);

  console.log("user", user);

  return (
    <main className="container mx-auto py-8 px-4">
      <QuizResults quizData={data} user={user} />
    </main>
  );
}
