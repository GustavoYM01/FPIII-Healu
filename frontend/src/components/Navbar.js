import { useAuthentication } from "../hooks/userAuthentication";
import { Link } from "react-router-dom";

import Profile from "../imgs/user.svg";

const Navbar = () => {
  const { logout } = useAuthentication();

  return (
    <div className="content_navbar">
      <button id="logout" onClick={logout}>
        sair
      </button>
      <Link to="/perfil">
        <button id="profile_btn">
          <img src={Profile} alt="Foto do usuário" />
        </button>
      </Link>
    </div>
  );
};

export default Navbar;
