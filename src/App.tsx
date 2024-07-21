import {
  BrowserRouter as Router,
  Route,
  Routes,
  useRoutes,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Tvs from "./Routes/Tvs";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />
        <Route path="/movies/:category/:id" element={<Home />} />
        <Route path="/tv" element={<Tvs />} />
        <Route path="/tv/:category/:id" element={<Tvs />} />
      </Routes>
    </Router>
  );
}

export default App;
