import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import Ladder from './pages/Ladder';
import TournamentDetails from './pages/TournamentDetails';
import Login from './pages/Login';

const server = "http://localhost:8801";

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/tournament-details" element={<TournamentDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>      
      </BrowserRouter>

    </div>
  );
}

export default App;
