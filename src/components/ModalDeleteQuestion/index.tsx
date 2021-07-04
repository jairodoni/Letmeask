import Modal from "react-modal";
import { database } from "../../services/firebase";

interface ModalDeleteQuestionProps {
  questionId: string | undefined;
  setQuestion: (question: string | undefined) => void;
  roomId: string;
}

export function ModalDeleteQuestion({ questionId, setQuestion, roomId }: ModalDeleteQuestionProps) {

  async function handleDeleteQuestion() {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    setQuestion(undefined);
  }

  return (
    <Modal
      isOpen={questionId !== undefined}
      onRequestClose={() => setQuestion(undefined)}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <div className="modal-delete">

        <button type="button" onClick={() => setQuestion(undefined)} className="react-modal-close">Cancelar</button>
        <button type="button" onClick={handleDeleteQuestion}>Delete</button>
      </div>
    </Modal>
  )
}