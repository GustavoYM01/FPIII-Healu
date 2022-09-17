import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuNavigation from "../../components/MenuNavigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const dayOfWeek = () => {
  let semana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];

  let d = new Date();

  document.getElementById("week_day").innerText = `${
    semana[d.getDay()]
  } - ${d.getDate()}`;
};

const TodoList = () => {
  const [users, setUsers] = useState([]);
  const [horario, setHorario] = useState("");
  const [afazer, setAfazer] = useState("");
  const [paciente, setPaciente] = useState("");

  const currentUser = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
      if (users.length === 1) {
        setPaciente(users[0].userName);
      }
    });
    return () => unsub();
  }, []);

  let hrefPage = window.location.href;

  function toggleModal() {
    let modal = document.querySelector("#modal");
    let fade = document.querySelector("#fade");
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await addDoc(collection(db, "to-doPatients", currentUser, "to-do"), {
        horario,
        afazer,
        paciente,
      });
      toast.success("Afazer adicionado com sucesso!");
      function reloadCurrentPage() {
        window.location.reload();
      }
      setTimeout(reloadCurrentPage, 3800);
    } catch (error) {
      toast.error("Erro, por favor tente mais tarde");
    }
  };

  return (
    <div className="center_container">
      <ToastContainer autoClose={2000} />
      <Sidebar />
      <MenuNavigation hrefPage={hrefPage} />
      <Navbar />
      <div id="fade" className="hide"></div>
      <h2 id="week_day">{setTimeout(dayOfWeek, 20)}</h2>
      <button id="btn_afazer" onClick={toggleModal}>
        Adicionar afazeres
      </button>
      <div id="modal" className="hide">
        <div className="modal_header">
          <h3>Afazeres do Paciente</h3>
          <button id="btn_fecharModal" onClick={toggleModal}>
            X
          </button>
        </div>
        <div class="modal_body">
          <form id="form_afazeres" onSubmit={handleSubmit}>
            <div id="label_horario">
              <label>Horário</label>
              <input
                type="time"
                name="horario"
                id="horario"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
            <div id="label_afazer">
              <label>Afazer</label>
              <input
                type="text"
                name="afazer"
                id="afazer"
                value={afazer}
                onChange={(e) => setAfazer(e.target.value)}
              />
            </div>
            <div id="label_paciente">
              <label>Paciente</label>
              <select
                name="paciente"
                id="paciente"
                value={paciente}
                onChange={(e) => setPaciente(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.uid} value={user.userName}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>
            <input id="btn_form_afazeres" type="submit" value="Enviar" />
          </form>
        </div>
      </div>
      {/* <div className="content_todolist">
        <div className="times">
          <p>07:00</p>
          <div className="progress_bar"></div>
          <p>09:00</p>
          <div className="progress_bar"></div>
          <p>10:00</p>
          <div className="partial_progress_bar"></div>
          <p id="no_concluded">13:15</p>
          <div className="progress_bar" id="progress_bar_no_concluded"></div>
        </div>
        <div className="todolist">
          <ul>
            <li>Café da manhã - lorem ipsum</li>
            <li>Intervalo - lorem ipsum</li>
            <li>Almoço - lorem ipsum</li>
            <li>Intervalo 2 - lorem ipsum</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default TodoList;
