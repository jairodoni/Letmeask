import toast, { Toaster } from 'react-hot-toast';
import copyImg from '../../assets/images/copy.svg';

import "./styles.scss"

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code)
    toast.success("Codigo copiado 👍");
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
      <button className="room-code">
        <div onClick={copyRoomCodeToClipboard}>
          <img src={copyImg} alt="Copy room code" />
        </div>
        <span>Codigo #{code}</span>
      </button>
    </>
  )
}