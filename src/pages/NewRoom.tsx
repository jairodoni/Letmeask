import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { HeadComponent } from "../components/HeadComponent";
import { useAuth } from '../contexts/AuthContext';
import { database } from '../services/firebase';
import "../styles/auth.scss";

interface NewRoom {
  titleNewRoom: string;
}

const schemaForm = yup.object().shape({
  titleNewRoom: yup.string().required('*Nome da sala obrigatorio').max(150)
})

export default function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schemaForm)
  });

  async function handleCreateRoom(data: NewRoom) {

    //caso o usuario tente criar uma sala sem nome a função para nesse if
    if (data.titleNewRoom.trim() === '') {
      return;
    }

    if (user) {
      const roomRef = database.ref('rooms');
      //use "push" para cadastrar uma lista no firebase
      //use "set" caso cadastre uma informação unica
      const firebaseRoom = await roomRef.push({
        title: data.titleNewRoom,
        authorId: user?.id,
      });

      localStorage.setItem("@letmeask/room", `${firebaseRoom.key}`);

      history.push(`/admin/rooms/${firebaseRoom.key}`);
    } else {
      toast.error("Faça login antes de prosseguir.");
    }
  }

  useEffect(() => {
    async function Validate() {
      const roomId = localStorage.getItem('@letmeask/room');
      const roomRef = await database.ref(`rooms/${roomId}`).get();

      if (!user || user && roomRef.exists() && !roomRef.val().closedAt) {
        history.push("/")
      }
    }
    Validate();
  }, [user])

  return (
    <>
      <HeadComponent title="Criar sala" />

      <Toaster
        position="top-center"
        reverseOrder={true}
      />

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
            <form onSubmit={handleSubmit(handleCreateRoom)}>
              <input
                type="text"
                placeholder="Nome da sala"
                className={`${errors?.titleNewRoom?.message ? 'error' : ''}`}
                {...register('titleNewRoom')}
              />

              {!!errors.titleNewRoom && (
                <span>
                  {errors.titleNewRoom.message}
                </span>
              )}

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
    </>
  )
}
