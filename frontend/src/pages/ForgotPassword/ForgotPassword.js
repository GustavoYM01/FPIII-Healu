import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Back from "../../imgs/backward.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Email enviado com sucesso! Verifique a sua caixa de emails"
      );
      function returnToSignIn() {
        if (window.location.href === "http://localhost:5000/esquecisenha") {
          window.location.assign("http://localhost:5000/entrar");
        } else {
          window.location.assign("http://localhost:5001/entrar");
        }
      }
      setTimeout(returnToSignIn, 3600);
    } catch (error) {
      toast.error("Erro, tente novamente mais tarde");
    }
  };

  return (
    <div className="container">
      <a id="return" href="/entrar">
        <img id="backward" src={Back} alt="Retornar" />
      </a>
      <ToastContainer autoClose={2000} />
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            id="input_email"
            placeholder="Informe o seu email"
            value={email}
            onChange={onChange}
          />
          <div className="btn_submit">
            <input type="submit" value="Trocar senha" />
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
