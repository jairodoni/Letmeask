import copyImg from '../../assets/images/copy.svg';

import "./styles.scss"

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code)
  }

  return (
    <button className="room-code">
      <div onClick={copyRoomCodeToClipboard}>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{code}</span>
    </button>
  )
}