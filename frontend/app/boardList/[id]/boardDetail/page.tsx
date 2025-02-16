import BoardDetail from "@/features/boardDetail/boardDetail";

interface BoardDetailParamsProps {
  params: {
    id: string;
  };
}

const Home = async ({ params }: BoardDetailParamsProps) => {
  const { id } = await params;
  const boardId = Number(id);

  return (
    <>
      <BoardDetail boardId={boardId} />
    </>
  );
};

export default Home;
