import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import Ladder from './pages/Ladder';
import TournamentDetails from './pages/TournamentDetails';
import Login from './pages/Login';
import Account from './pages/Account';
import ForgotPass from './pages/ForgotPass';
import ResetPass from './pages/ResetPass';

const server = "http://localhost:8801";

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/tournament-details/:id" element={<TournamentDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/forgot_password" element={<ForgotPass />} />
          <Route path="/reset_password" element={<ResetPass />} />
        </Routes>      
      </BrowserRouter>

    </div>
  );
}

export default App;
