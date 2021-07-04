import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RoomCode } from '../RoomCode';
import { OptionsComponent } from '../OptionsComponent';
import logoImg from '../../assets/images/logo.svg'
import '../../styles/room.scss';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../services/firebase';


interface HeaderProps {
  code: string;
  children?: ReactNode;
}

export function Header({ children, code }: HeaderProps) {
  const { user } = useAuth();
  const [route, setRoute] = useState('/')

  async function handleGoPageHome() {
    const roomId = localStorage.getItem('@letmeask/room');
    const roomRef = await database.ref(`rooms/${roomId}`).get();

    if (roomRef.exists() && !roomRef.val().closedAt) {
      setRoute(`/admin/rooms/${roomId}`);
    }
  }

  useEffect(() => {
    handleGoPageHome();
  }, [])

  return (
    <header>
      <div className="content">
        <Link to={route}>
          <img src={logoImg} alt="Letmeask" />
        </Link>
        <div>
          <RoomCode code={code} />
          {children}
          {user &&
            <>
              <div className="divider" />
              <OptionsComponent >
                <button className="avatar">
                  <img src={user?.avatar} alt={user?.name} />
                </button>
              </OptionsComponent>
            </>
          }
        </div>
      </div>
    </header>
  )
}