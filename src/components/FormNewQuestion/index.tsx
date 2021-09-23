import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../services/firebase';
import { Button } from '../Button';

type RoomParams = {
  id: string;
};

export function FormNewQuestion() {
  const { user, signInWithGoogle } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const params = useParams<RoomParams>();
  const roomId = params.id;

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    try {
      if (newQuestion.trim() === '') {
        return;
      }

      if (!user) {
        return toast.error('You must be logged in.');
      }

      const question = {
        content: newQuestion,
        author: {
          name: user.name,
          avatar: user.avatar,
        },
        isHighlighted: false,
        isAnswered: false,
      };

      await database.ref(`rooms/${roomId}/questions`).push(question);
      toast.success('Pergunta enviada!!! 👏');
      setNewQuestion('');
    } catch {
      return toast.error(
        'Não foi possivel enviar sua pergunta, tente novamente mais tarde.'
      );
    }
  }

  return (
    <form onSubmit={handleSendQuestion}>
      <textarea
        placeholder="O que você quer perguntar?"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />

      <div className="form-footer">
        {user ? (
          <div className="user-info">
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
          </div>
        ) : (
          <span>
            Para enviar uma perguntar,{' '}
            <button type="button" onClick={signInWithGoogle}>
              faça seu login
            </button>
            .
          </span>
        )}
        <Button type="submit" disabled={!user}>
          Enviar pergunta
        </Button>
      </div>
    </form>
  );
}
