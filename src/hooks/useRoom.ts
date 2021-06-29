import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Questions[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    //"on" serve para ouvir um evento mais de uma vez
    //troque para "once" para ouvir um evento uma unica vez
    //e "val" serve para buscar os dados da "room"
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([key, like]) => like.authorId === user?.id
          )?.[0],
          createdAt: new Date(),
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(parseQuestions);
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id]);

  return { title, questions };
}
