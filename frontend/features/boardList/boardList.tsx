import BoardListClient from "@/features/boardList/boardListClient";

export interface IBoardList {
  boardId: number;
  boardName: string;
  structure: string;
  stencil: boolean;
  boardImgPath: string;
}

const fetchBoards = async () => {
  const response = await fetch("http://localhost:3000/backend/v1/boards", {
    cache: "no-store",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return await response.json();
};

const BoardList = async () => {
  try {
    const boardList: IBoardList[] = await fetchBoards();
    return <BoardListClient boardList={boardList} />;
  } catch (error) {
    console.log(error);
  }
};

export default BoardList;
