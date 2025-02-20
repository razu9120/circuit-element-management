import EditBoard from "@/features/editBoard/editBoard";

interface IEditBoardParamsProps {
  params: {
    id: string;
  };
}

const Home = async ({ params }: IEditBoardParamsProps) => {
  const { id } = await params;
  const boardId = Number(id);

  return (
    <>
      <EditBoard boardId={boardId} />
    </>
  );
};

export default Home;
