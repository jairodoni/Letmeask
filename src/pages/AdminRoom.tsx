import { useEffect, useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import answerImg from '../assets/images/answer.svg';
import checkImg from '../assets/images/check.svg';
import deleteImg from '../assets/images/delete.svg';
import noQuestionsImg from '../assets/images/empty-questions.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { HeadComponent } from "../components/HeadComponent"
import { OptionsComponent } from "../components/OptionsComponent"
import { ModalDeleteQuestion } from '../components/ModalDeleteQuestion'
import { database } from '../services/firebase';
import '../styles/room.scss';
import { useAuth } from '../contexts/AuthContext';

type RoomParams = {
  id: string;
}

export default function AdminRoom() {
  const { user } = useAuth()
  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>(undefined);

  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  const history = useHistory();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    })
    history.push("/");
  }

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

        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
              {user && (
                <>
                  <div className="divider" />
                  <OptionsComponent>
                    <button className="avatar">
                      <img src={user?.avatar} alt={user?.name} />
                    </button>
                  </OptionsComponent>
                </>
              )}
            </div>
          </div>
        </header>

        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          </div>

          <div className="question-list">
            {questions.length > 0 && questions.map(question => (
              <Fragment>
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
                <ModalDeleteQuestion
                  questionId={questionIdModalOpen}
                  setQuestion={setQuestionIdModalOpen}
                  roomId={roomId}
                />
              </Fragment>
            ))}
          </div>
          {
            questions.length === 0 && (
              <div className="none-questions">

                <img src={noQuestionsImg} alt="Sem mais perguntas" />
                <h5>Nenhuma pergunta por aqui...</h5>
                <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
              </div>

            )
          }
        </main>
      </div>
    </>
  )
}