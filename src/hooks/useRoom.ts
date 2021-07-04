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
    createdAt: Date;
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
    async function ListQuestions() {
      const roomRef = await database.ref(`rooms/${roomId}`).get();

      if (!roomRef.exists()) {
        return;
      }

      if (roomId) {
        const roomRef = await database.ref(`rooms/${roomId}`);

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
            };
          });

          //Ordena por numero de likes
          const questionsSortedByLikeCount = parseQuestions.sort(
            (a, b) => b.likeCount - a.likeCount
          );

          //Seleciona somente perguntas não respondidas
          const questionsSortedByAnsweredFalse = questionsSortedByLikeCount.filter(
            (question) => question.isAnswered === false
          );
          //Seleciona somente perguntas ja respondidas
          const questionsSortedByAnsweredTrue = questionsSortedByLikeCount.filter(
            (question) => question.isAnswered === true
          );

          setTitle(databaseRoom.title);

          //Adiciona as perguntas não respondidar na lista
          // e deixa as não respondidas por ultimo
          setQuestions([
            ...questionsSortedByAnsweredFalse,
            ...questionsSortedByAnsweredTrue,
          ]);
        });

        return () => {
          roomRef.off("value");
        };
      }
    }

    ListQuestions();
  }, [roomId, user?.id]);

  return { title, questions };
}
