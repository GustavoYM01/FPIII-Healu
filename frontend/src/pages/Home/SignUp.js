import logoForm from "../../imgs/logo_form.svg";

import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/userAuthentication";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
// import InputMask from "react-input-mask";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [healthProfessional, setHealthProfessional] = useState("");
  // const [dob, setDob] = useState(""); // dob = date of birth
  const [error, setError] = useState("");

  const { createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      userName,
      email,
      password,
      healthProfessional,
    };

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais!");
      return;
    }

    const res = await createUser(user);

    let isHealthProfessional;

    if (user.healthProfessional === "true") {
      isHealthProfessional = true;
    } else if (user.healthProfessional === "false") {
      isHealthProfessional = false;
    }

    await setDoc(doc(db, "users", res.uid), {
      uid: res.uid,
      userName,
      email,
      isHealthProfessional,
      createdAt: Timestamp.fromDate(new Date()),
      isOnline: true,
    });
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="form_container">
      <img id="logo_form2" src={logoForm} alt="logo do formulário" />
      <form className="form_signup" onSubmit={handleSubmit}>
        <input
          type="text"
          id="input_userName"
          name="userName"
          required
          placeholder="Digite um nome de usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          id="input_email"
          name="email"
          required
          placeholder="Digite um email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="input_password"
          name="password"
          required
          placeholder="Digite uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          id="input_confirm_password"
          name="confirmPassword"
          required
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <p id="question">Você é um profissional da saúde?</p>
        <div className="yes">
          <input
            type="radio"
            name="healthProfessional"
            id="healthProfessional"
            value="true"
            onChange={(e) => setHealthProfessional(e.target.value)}
          />
          <label>Sim</label>
        </div>
        <div className="no">
          <input
            type="radio"
            name="healthProfessional"
            id="healthProfessional"
            value="false"
            onChange={(e) => setHealthProfessional(e.target.value)}
          />
          <label>Não</label>
        </div>
        {!loading && (
          <input type="submit" id="input_submit2" value="Criar conta" />
        )}
        {loading && (
          <input type="submit" id="input_submit2" disabled value="aguarde..." />
        )}
      </form>
      <div id="after_form2">
        <p>Já possui uma conta?</p>
        <a href="/entrar">Entre</a>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignUp;
