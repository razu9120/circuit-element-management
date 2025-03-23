import { auth } from "@/auth";
import BoardListClient from "@/features/boardList/boardListClient";
export interface IBoardList {
  userId: number;
  boardId: number;
  boardName: string;
  structure: string;
  stencil: boolean;
  boardImgPath: string;
  hasElements: boolean;
}

const fetchBoards = async (userId: number) => {
  const response = await fetch(
    `http://localhost:3000/backend/v1/boards/${userId}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return await response.json();
};

const BoardList = async () => {
  try {
    const session = await auth();
    const boardList: IBoardList[] = await fetchBoards(
      Number(session?.user?.id)
    );
    return <BoardListClient boardList={boardList} />;
  } catch (error) {
    console.log(error);
  }
};

export default BoardList;
