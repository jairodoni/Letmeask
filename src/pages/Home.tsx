import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { HeadComponent } from "../components/HeadComponent"
import googleIconImg from '../assets/images/google-icon.svg'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { database } from '../services/firebase'
import "../styles/auth.scss"

interface RoomCode {
  roomCode: string;
}

const schemaForm = yup.object().shape({
  roomCode: yup.string().required('*Codigo obrigatorio')
})

export default function Home() {
  const { user, signInWithGoogle } = useAuth()
  const history = useHistory();


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schemaForm)
  });


  async function handleGoPageHome() {
    const roomId = localStorage.getItem('@letmeask/room');

    const roomRef = await database.ref(`rooms/${roomId}`).get();

    if (!user) {
      await signInWithGoogle();
    }

    if (roomRef.exists() && !roomRef.val().closedAt) {
      history.push(`admin/rooms/${roomId}`);
    } else {
      history.push('rooms/new');
    }
  }

  async function handleJoinRoom(data: RoomCode) {
    if (data.roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${data.roomCode}`).get();


    if (!roomRef.exists()) {
      toast.error("Esta sala não existe.");
      return;
    }

    if (roomRef.val().closedAt) {
      toast.error("Esta sala foi fechada 😥");
      return;
    }

    history.push(`/rooms/${data.roomCode}`);
  }
  return (
    <>
      <HeadComponent title="Login" />

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
            <button onClick={handleGoPageHome} className="create-room">
              <img src={googleIconImg} alt="Logo do Google" />
              Crie sua sala com o Google
            </button>
            <div className="separator">ou entre em uma sala</div>
            <form onSubmit={handleSubmit(handleJoinRoom)}>


              <input
                type="text"
                placeholder="Digite o codigo da sala"
                className={`${errors?.roomCode?.message ? 'error' : ''}`}
                {...register('roomCode')}
              />
              {!!errors.roomCode && (
                <span>
                  {errors.roomCode.message}
                </span>
              )}

              <Button type="submit" >
                Entrar na sala
              </Button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}