import BoardDetail from "@/features/boardDetail/boardDetail";

interface IBoardDetailParamsProps {
  params: {
    id: string;
  };
}

const Home = async ({ params }: IBoardDetailParamsProps) => {
  const { id } = await params;
  const boardId = Number(id);

  return (
    <>
      <BoardDetail boardId={boardId} />
    </>
  );
};

export default Home;
