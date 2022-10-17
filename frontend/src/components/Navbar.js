import { useAuthentication } from "../hooks/userAuthentication";
import { Link } from "react-router-dom";

import Profile from "../imgs/user.svg";
import Logout from "../imgs/SignOut.svg";

const Navbar = () => {
  const { logout } = useAuthentication();

  return (
    <div className="content_navbar">
      {window.innerWidth <= 500 ? (
        <div onClick={logout}>
          <img id="signout" src={Logout} alt="Sair do app" />
        </div>
      ) : (
        <button id="logout" onClick={logout}>
          Sair
        </button>
      )}
      <Link to="/perfil">
        <button id="profile_btn">
          <img src={Profile} alt="Foto do usuário" />
        </button>
      </Link>
    </div>
  );
};

export default Navbar;
