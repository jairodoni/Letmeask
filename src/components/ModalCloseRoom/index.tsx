import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { database } from "../../services/firebase";
import "./styles.scss";

interface ModalDeleteQuestionProps {
  roomId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ModalCloseRoom({ roomId, isOpen, setIsOpen }: ModalDeleteQuestionProps) {
  const history = useHistory();

  async function handleCloseRoom() {
    setIsOpen(false);
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    })
    history.push('/');
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <div className="modal-delete">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.66 18.3398L18.34 29.6598" stroke="#E73F5D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M29.66 29.6598L18.34 18.3398" stroke="#E73F5D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z" stroke="#E73F5D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <h1>Encerrar sala</h1>
        <p>Tem certeza que você deseja encerrar esta sala?</p>
        <div>
          <button
            type="button"
            className="cancel"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="delete"
            onClick={handleCloseRoom}
          >
            Sim, encerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}