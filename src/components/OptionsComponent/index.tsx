import { ReactNode } from 'react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
// import { GiEvilMoon } from 'react-icons/gi';
import { GiTalk } from 'react-icons/gi';
import { GoSignOut } from 'react-icons/go';
import { MdSpeakerNotes } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../services/firebase';

interface PopoverComponentProps {
  children: ReactNode;
}

export function OptionsComponent({ children }: PopoverComponentProps) {
  const { signOut } = useAuth();
  const history = useHistory();

  async function goToYourRoom() {
    const roomId = localStorage.getItem('@letmeask/room');

    const roomRef = await database.ref(`rooms/${roomId}`).get();

    if (roomRef.exists() && !roomRef.val()?.closedAt) {
      history.push(`/admin/rooms/${roomId}`);
    }

    return;
  }
  function goToOtherRoom() {
    history.push('/');
  }

  async function Logout() {
    const roomId = localStorage.getItem('@letmeask/room');

    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });
    signOut();
    history.push('/');
  }

  return (
    <Popover placement="left">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        bg="#353646"
        w="150px"
        borderRadius="8px"
        mr="-45px"
        mt="60px"
      >
        {/* <Button
          bg="#353646"
          color="#EEEEF2"
          border="none"
          justifyContent="start"
          fontWeight="400"
          borderRadius="8px 8px 0 0"
          _hover={{
            bg: "#4B4D63"
          }}
          variant="ghost"
        >

          <GiEvilMoon style={{ marginRight: "5px", marginLeft: "8px" }} size={16} />
          Trocar tema
        </Button> */}
        <Button
          bg="#353646"
          color="#EEEEF2"
          border="none"
          justifyContent="start"
          fontWeight="400"
          borderRadius="8px 8px 0 0"
          _hover={{
            bg: '#4B4D63',
          }}
          variant="ghost"
          onClick={goToYourRoom}
        >
          <MdSpeakerNotes
            style={{ marginRight: '5px', marginLeft: '8px' }}
            size={16}
          />
          Sala Admin
        </Button>
        <Button
          bg="#353646"
          color="#EEEEF2"
          border="none"
          justifyContent="start"
          fontWeight="400"
          borderRadius="0"
          _hover={{
            bg: '#4B4D63',
          }}
          variant="ghost"
          onClick={goToOtherRoom}
        >
          <GiTalk style={{ marginRight: '5px', marginLeft: '8px' }} size={16} />
          Acessar salas
        </Button>
        <Button
          bg="#353646"
          color="#EEEEF2"
          border="none"
          justifyContent="start"
          fontWeight="400"
          borderRadius="0 0 8px 8px"
          _hover={{
            bg: '#4B4D63',
          }}
          variant="ghost"
          onClick={Logout}
        >
          <GoSignOut
            style={{ marginRight: '5px', marginLeft: '8px' }}
            size={18}
          />
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  );
}
