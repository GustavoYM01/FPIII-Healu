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
    <>
      {window.innerHeight <= 568 ? (
        <div className="form_container">
          <div id="divLogo_title">
            <div>
              <img id="logo_form" src={logoForm} alt="logo do formulário" />
              <div class="scroll-down"></div>
              <h1 id="logo_title">HEALU</h1>
            </div>
          </div>
          <div id="divForm">
            <h2>Lorem ipsum dolor</h2>
            <div>
              <form className="form_signin" onSubmit={handleSubmit}>
                <input
                  type="email"
                  id="input_email"
                  name="email"
                  required
                  placeholder="Digite o seu email"
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
                  <a href="/esquecisenha">Esqueci a senha</a>
                </div>
                {!loading && (
                  <input type="submit" id="input_submit" value="Login" />
                )}
                {loading && (
                  <input
                    type="submit"
                    id="input_submit"
                    disabled
                    value="aguarde..."
                  />
                )}
              </form>
              <div id="after_form">
                <p>Não possui conta?</p>
                <a href="/cadastrar">Cadastre-se</a>
              </div>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="form_container">
          <div id="divLogo_title">
            <div>
              <img id="logo_form" src={logoForm} alt="logo do formulário" />
              <h1 id="logo_title">HEALU</h1>
            </div>
          </div>
          <div id="divForm">
            <h2>Lorem ipsum dolor</h2>
            <div>
              <form className="form_signin" onSubmit={handleSubmit}>
                <input
                  type="email"
                  id="input_email"
                  name="email"
                  required
                  placeholder="Digite o seu email"
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
                  <a href="/esquecisenha">Esqueci a senha</a>
                </div>
                {!loading && (
                  <input type="submit" id="input_submit" value="Login" />
                )}
                {loading && (
                  <input
                    type="submit"
                    id="input_submit"
                    disabled
                    value="aguarde..."
                  />
                )}
              </form>
              <div id="after_form">
                <p>Não possui conta?</p>
                <a href="/cadastrar">Cadastre-se</a>
              </div>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
