import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

import MenuNavigation from "../../components/MenuNavigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TodoPatients from "../../components/TodoPatients";
import Modal from "../../components/Modal";
import DaysOfWeek from "../../components/DaysOfWeek";

// const dayOfWeek = () => {
//   let semana = [
//     "Domingo",
//     "Segunda-Feira",
//     "Terça-Feira",
//     "Quarta-Feira",
//     "Quinta-Feira",
//     "Sexta-Feira",
//     "Sábado",
//   ];

//   let d = new Date();

//   document.getElementById("week_day").innerText = `${
//     semana[d.getDay()]
//   } - ${d.getDate()}`;
// };

const TodoList = () => {
  const [afazeresPaciente, setAfazeresPaciente] = useState([]);
  const [afazeresPacPaciente, setAfazeresPacPaciente] = useState([]);
  const [profSaude, setProfSaude] = useState([]);

  const currentUser = auth.currentUser.uid;
  const displayName = auth.currentUser.displayName;

  let afazeresEffect = [];
  let afazeresPacPacienteEffect = [];
  let nomeProfSaude = [];

  useEffect(() => {
    // Para listar os afazeres (no login de um paciente)
    const todoPatientRef = collection(db, "to-doPatients");
    const q = query(todoPatientRef, where("paciente", "in", [displayName]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        afazeresPacPacienteEffect.push(doc.data());
      });
      setAfazeresPacPaciente(afazeresPacPacienteEffect);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Para os afazeres dos pacientes (no login de um profissional de saúde)
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

  let hrefPage = window.location.href;

  const toggleModal = () => {
    let modal = document.querySelector("#modal");
    let fade = document.querySelector("#fade");
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
  };

  return (
    <div className="center_container">
      <Sidebar />
      <MenuNavigation hrefPage={hrefPage} />
      <Navbar />
      <div id="fade" className="hide"></div>
      {window.innerWidth > 450 ? <DaysOfWeek /> : null}
      {/* {window.innerWidth > 450 ? (
        <h2 id="week_day">{setTimeout(dayOfWeek, 15)}</h2>
      ) : null} */}
      {profSaude.length > 0 && profSaude[0].isHealthProfessional !== false ? (
        <button id="btn_afazer" onClick={toggleModal}>
          Adicionar afazeres
        </button>
      ) : null}
      <Modal />
      {afazeresPaciente.length > 0 ? (
        <div className="todoPatients prof">
          {afazeresPaciente.map((afazeres) => (
            <TodoPatients key={afazeres.uid} todo={afazeres} />
          ))}
        </div>
      ) : (
        <div className="todoPatients">
          {afazeresPacPaciente.map((afazeres) => (
            <TodoPatients key={afazeres.uid} todo={afazeres} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
