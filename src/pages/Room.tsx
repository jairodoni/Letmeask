import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../services/firebase';

import '../styles/room.scss'

type FirebaseQuestions = Record<string, {
  author: {
    nome: string;
    avatar: string;
  }
  content: string;
  isAnswared: boolean;
  isHighlighted: boolean;
}>

type Questions = {
  id: string;
  author: {
    nome: string;
    avatar: string;
  }
  content: string;
  isAnswared: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}

export default function Room() {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');

  const params = useParams<RoomParams>();

  const roomId = params.id;

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    try {
      if (newQuestion.trim() === '') {
        return;
      }

      if (!user) {
        return toast.error("You must be logged in.");
      }
      const question = {
        content: newQuestion,
        author: {
          name: user.name,
          avatar: user.avatar
        },
        isHighlighted: false,
        isAnswared: false,
      };

      await database.ref(`rooms/${roomId}/questions`).push(question);
      toast.success("Pergunta enviada!!!");
      setNewQuestion('')
    } catch {
      return toast.error("Não foi possivel enviar sua pergunta, tente novamente mais tarde.");
    }
  }

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    //"on" serve para ouvir um evento mais de uma vez
    //troque para "once" para ouvir um evento uma unica vez
    //e "val" serve para buscar os dados da "room"
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswared: value.isAnswared
        }
      });
      setTitle(databaseRoom.title)
      setQuestions(parseQuestions);
    });
  }, [roomId]);

  return (
    <div id="page-room">
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma perguntar, <button>faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  )
}