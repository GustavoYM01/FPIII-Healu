import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { useState, useEffect } from "react";
import { useAuthentication } from "./hooks/userAuthentication";

// context
import { AuthProvider } from "./context/AuthContext";

// pages
import SignIn from "./pages/Home/SignIn";
import SignUp from "./pages/Home/SignUp";
import TodoList from "./pages/TodoList/TodoList";
import Chat from "./pages/Chat/Chat";
import Call from "./pages/Call/Call";
import Profile from "./pages/Profile/Profile";
import VideoCall from "./pages/Meeting/Meeting";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={user ? <Call /> : <Navigate to="/entrar" />}
            />
            <Route
              path="/video/:id"
              element={user ? <VideoCall /> : <Navigate to="/entrar" />}
            />
            <Route
              path="/cadastrar"
              element={!user ? <SignUp /> : <Navigate to="/lista" />}
            />
            <Route path="/esquecisenha" element={<ForgotPassword />} />
            <Route
              path="/entrar"
              element={!user ? <SignIn /> : <Navigate to="/lista" />}
            />
            <Route
              path="/lista"
              element={user ? <TodoList /> : <Navigate to="/entrar" />}
            />
            <Route
              path="/chat"
              element={user ? <Chat /> : <Navigate to="/entrar" />}
            />
            <Route
              path="/perfil"
              element={user ? <Profile /> : <Navigate to="/entrar" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
