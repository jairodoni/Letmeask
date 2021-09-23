import { Routes } from './routes';
import { AuthContextProvider } from './contexts/AuthContext';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  return (
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  );
}

export default App;
