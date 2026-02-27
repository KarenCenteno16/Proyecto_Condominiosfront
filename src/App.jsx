import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Residentes from "./pages/Residentes";
import Pagos from "./pages/Pagos";
import Chat from "./pages/Chat";
import Accesos from "./pages/Accesos";
import Asambleas from "./pages/Asambleas"; 
import Reportes from "./pages/Reportes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/residentes" element={<Residentes />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/accesos" element={<Accesos />} />
          <Route path="/asambleas" element={<Asambleas />} /> 
          <Route path="/reportes" element={<Reportes />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;