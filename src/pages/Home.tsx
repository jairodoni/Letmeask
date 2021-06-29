import { FormEvent, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router-dom'
import googleIconImg from '../assets/images/google-icon.svg'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../services/firebase'
import "../styles/auth.scss"


export default function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('');

  function handleGoPageNewRoom() {
    if (!user) {
      signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Esta sala não existe.");
      return;
    }

    if (roomRef.val().closedAt) {
      toast.error("Esta sala foi fechada 😥");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
      <aside>
        <img src={illustrationImg} alt="Ilustração sinbolizando perguntas e respostas" />
        <strong>Crie salas Q&amp;A ao-vivo</strong>
        <p>Tire  as duvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleGoPageNewRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form>
            <input
              type="text"
              placeholder="Digite o codigo da sala"
              onChange={event => setRoomCode(event.target.value)}
            />
            <Button type="submit" onClick={handleJoinRoom}>
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}