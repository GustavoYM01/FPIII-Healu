import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuNavigation from "../../components/MenuNavigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TodoPatients from "../../components/TodoPatients";

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
  const [afazeresPaciente, setAfazeresPaciente] = useState([]);

  const currentUser = auth.currentUser.uid;
  let usersUseEffect = [];
  let afazeresEffect = [];

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        usersUseEffect.push(doc.data());
      });
      setUsers(usersUseEffect);
    });
    if (users.length === 1) {
      setPaciente(users[0].userName);
    }
    // console.log(users);
    return () => unsub();
  }, []);

  let hrefPage = window.location.href;

  function toggleModal() {
    let modal = document.querySelector("#modal");
    let fade = document.querySelector("#fade");
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
  }

  let todoPatient;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      todoPatient = await addDoc(collection(db, "to-doPatients"), {
        horario,
        afazer,
        paciente,
        createdAt: Timestamp.fromDate(new Date()),
        from: currentUser,
      });
      if (paciente === "") {
        await updateDoc(todoPatient, {
          paciente: users[0].userName,
        });
      }
      toast.success("Afazer adicionado com sucesso!");
      function reloadPage() {
        window.location.reload();
      }
      setTimeout(reloadPage, 3900);
    } catch (error) {
      console.log(`${error}` || `${error.message}`);
      toast.error("Erro, por favor tente mais tarde");
    }
  };

  useEffect(() => {
    const todoPatientsRef = collection(db, "to-doPatients");
    const q = query(todoPatientsRef, where("from", "in", [currentUser]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        afazeresEffect.push(doc.data());
      });
      setAfazeresPaciente(afazeresEffect);
    });
    return () => unsub();
  }, []);

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
          <h3>Afazer do Paciente</h3>
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
      {afazeresPaciente.length > 0 ? (
        <div className="todoPatients">
          {afazeresPaciente.map((afazeres) => (
            <TodoPatients key={afazeres.from} todo={afazeres} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TodoList;
