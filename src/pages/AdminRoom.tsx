import { Fragment, useEffect, useState } from 'react';
import { Fade } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { HeadComponent } from "../components/HeadComponent";
import { Header } from '../components/Header';
import { ModalCloseRoom } from "../components/ModalCloseRoom";
import { ModalDeleteQuestion } from '../components/ModalDeleteQuestion';
import { Question } from '../components/Question';
import answerImg from '../assets/images/answer.svg';
import checkImg from '../assets/images/check.svg';
import deleteImg from '../assets/images/delete.svg';
import noQuestionsImg from '../assets/images/empty-questions.svg';
import { useAuth } from '../contexts/AuthContext';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function AdminRoom() {
  const { user } = useAuth()
  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>(undefined);
  const [isCloseRoomModalOpen, setIsCloseRoomModalOpen] = useState(false);

  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  const history = useHistory();

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    const question = questions.find(item => item.id === questionId);

    return await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !question?.isHighlighted,
    });
  }

  useEffect(() => {
    async function Validation() {
      const roomRef = await database.ref(`rooms/${roomId}`).get();
      const room = await database.ref(`rooms/${roomId}`)


      room.get().then(room => {
        if (room.val()?.closedAt || !user || !roomRef.exists()) {
          history.push("/")
        }
      })
    }

    Validation()
  }, [roomId, user])

  return (
    <>
      <HeadComponent title={title} />

      <div id="page-room">
        <Header code={roomId}>
          <Button isOutlined onClick={() => setIsCloseRoomModalOpen(true)}>Encerrar sala</Button>
        </Header>

        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          </div>
          <div className="question-list">
            {questions.length > 0 && questions.map(question => (
              <Fragment>
                <Fade in={true}>
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >

                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setQuestionIdModalOpen(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </Question>
                </Fade>
              </Fragment>
            ))}
          </div>
          {
            questions.length === 0 && (
              <div className="none-questions">
                <div>
                  <img src={noQuestionsImg} alt="Sem mais perguntas" />
                  <h5>Nenhuma pergunta por aqui...</h5>
                  <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
                </div>
              </div>
            )
          }
        </main>

      </div>
      <ModalDeleteQuestion
        questionId={questionIdModalOpen}
        setQuestion={setQuestionIdModalOpen}
        roomId={roomId}
      />
      <ModalCloseRoom
        roomId={roomId}
        isOpen={isCloseRoomModalOpen}
        setIsOpen={setIsCloseRoomModalOpen}
      />
    </>
  )
}