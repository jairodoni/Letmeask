import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { database } from '../services/firebase'
import "../styles/auth.scss"

export default function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('')

  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    //caso o usuario tente criar uma sala sem nome a função para nesse if
    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');
    //use "push" para cadastrar uma lista no firebase
    //use "set" caso cadastre uma informação unica
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração sinbolizando perguntas e respostas" />
        <strong>Crie salas Q&amp;A ao-vivo</strong>
        <p>Tire  as duvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
