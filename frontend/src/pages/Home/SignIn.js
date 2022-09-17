import logoForm from "../../imgs/logo_form.svg";

import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/userAuthentication";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);

    await updateDoc(doc(db, "users", res.uid), {
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
      <img id="logo_form" src={logoForm} alt="logo do formulário" />
      <form className="form_signin" onSubmit={handleSubmit}>
        <p>entrar</p>
        <input
          type="text"
          id="input_userName"
          name="email"
          required
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="input_password"
          name="password"
          required
          placeholder="Digite a sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="forgot_pass">
          <a href="/esquecisenha">
            Esqueci a senha
          </a>
        </div>
        {!loading && <input type="submit" id="input_submit" value="entrar" />}
        {loading && (
          <input type="submit" id="input_submit" disabled value="aguarde..." />
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <div id="after_form">
        <p>Não possui conta?</p>
        <a href="/cadastrar">Cadastre-se</a>
      </div>
    </div>
  );
};

export default SignIn;
