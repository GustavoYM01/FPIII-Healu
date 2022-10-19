import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import User from "./User";
import ArrowLeft from "../imgs/arrowLeft.svg";
import ArrowRight from "../imgs/arrowRight.svg";

const Sidebar = () => {
  const [pacientes, setPacientes] = useState([]);
  const [prof, setProf] = useState([]);
  const [profSaude, setProfSaude] = useState([]);
  const [chat, setChat] = useState("");

  const currentUser = auth.currentUser.uid;

  let nomeProfSaude = [];

  useEffect(() => {
    // Qualquer usuário
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  const boolean = true;
  const boolean2 = false;

  useEffect(() => {
    // Profissional da saúde (renderizar para o paciente)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("isHealthProfessional", "in", [boolean]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setProf(users);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Pacientes (renderizar para o profissional da saúde)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("isHealthProfessional", "in", [boolean2]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setPacientes(users);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Para validação do login (ver se é ou não, um profissional da saúde)
    const teste = async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "in", [currentUser])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        nomeProfSaude.push(doc.data());
      });
      setProfSaude(nomeProfSaude);
    };
    teste();
  }, []);

  const selectUser = (user) => {
    setChat(user);
  };

  const sideBar = document.querySelector(".sidebar");
  const btnToggle = document.querySelector(".btn_toggle");
  const menuNav = document.querySelector(".menu_navigation");
  const arrowIcon = document.querySelector(".arrow_icon");
  const arrowUpDown = document.querySelector(".arrowUpDown");

  const toggleSidebar = () => {
    if (sideBar && btnToggle && menuNav && arrowIcon && arrowUpDown) {
      arrowIcon.src = ArrowLeft;
      if (arrowUpDown.style.opacity === "0") {
        arrowUpDown.style.opacity = "1";
      } else {
        arrowUpDown.style.opacity = "0";
      }
      if (window.innerWidth <= 450) {
        if (menuNav.style.opacity === "0") {
          menuNav.style.opacity = "1";
        }
        menuNav.style.opacity = "0";
        if (sideBar.style.marginLeft < "0") {
          sideBar.style.marginLeft = "0";
          if (menuNav.style.opacity === "0") {
            menuNav.style.pointerEvents = "none";
          }
          btnToggle.style.marginLeft = "0";
        } else {
          arrowIcon.src = ArrowRight;
          sideBar.style.marginLeft = "-15em";
          menuNav.style.opacity = "1";
          menuNav.style.pointerEvents = "all";
          btnToggle.style.marginLeft = "-15em";
        }
      } else {
        if (sideBar.style.marginLeft < "0") {
          sideBar.style.marginLeft = "0";
          menuNav.style.marginLeft = "0";
          menuNav.style.opacity = "0";
          if (menuNav.style.opacity === "0") {
            menuNav.style.pointerEvents = "none";
          }
          btnToggle.style.marginLeft = "0";
        } else {
          arrowIcon.src = ArrowRight;
          sideBar.style.marginLeft = "-15em";
          menuNav.style.marginLeft = "-15em";
          menuNav.style.opacity = "1";
          menuNav.style.pointerEvents = "all";
          btnToggle.style.marginLeft = "-15em";
        }
      }
    }
  };

  return (
    <div className="sidebar">
      {window.innerWidth <= 1000 ? (
        <div className="btn_toggle" onClick={toggleSidebar}>
          <img
            className="arrow_icon"
            src={ArrowRight || ArrowLeft}
            alt="seta mostra menu"
          />
        </div>
      ) : null}
      <>
        {profSaude.length > 0 && profSaude[0].isHealthProfessional === false ? (
          <>
            {prof.map((prof) => (
              <User key={prof.uid} user={prof} selectUser={selectUser} />
            ))}
          </>
        ) : (
          <>
            {pacientes.map((paciente) => (
              <User
                key={paciente.uid}
                user={paciente}
                selectUser={selectUser}
              />
            ))}
          </>
        )}
      </>
    </div>
  );
};

export default Sidebar;
