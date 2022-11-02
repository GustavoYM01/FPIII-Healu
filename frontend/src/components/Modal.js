import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = () => {
  const [users, setUsers] = useState([]);
  const [profSaude, setProfSaude] = useState([]);
  const [horario, setHorario] = useState("");
  const [afazer, setAfazer] = useState("");
  const [tituloAfazer, setTituloAfazer] = useState("");
  const [paciente, setPaciente] = useState("");

  const currentUser = auth.currentUser.uid;

  let usersUseEffect = [];
  let nomeProfSaude = [];

  useEffect(() => {
    // Para listar os nomes dos pacientes
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setUsers([]);
      querySnapshot.forEach((doc) => {
        usersUseEffect.push(doc.data());
      });
      setUsers(usersUseEffect);
    });
    if (users.length === 1) {
      setPaciente(users[0].userName);
    }
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

  const makeid = (length) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  let id = makeid(16);

  const data = Date.now();
  const atual = new Date(data);

  const toggleModal = () => {
    let modal = document.querySelector("#modal");
    let fade = document.querySelector("#fade");
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
    setHorario("");
    setTituloAfazer("");
    setAfazer("");
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await setDoc(doc(db, "to-doPatients/" + id), {
        uid: id,
        horario,
        tituloAfazer,
        afazer,
        paciente,
        createdAt: atual.toLocaleDateString(),
        from: currentUser,
        responsavel: profSaude[0].userName,
      });
      if (paciente === "") {
        const docRef = doc(db, "to-doPatients", id);
        const data = {
          uid: id,
          horario,
          tituloAfazer,
          afazer,
          paciente: users[0].userName,
          createdAt: atual.toLocaleDateString(),
          from: currentUser,
          responsavel: profSaude[0].userName,
        };
        setDoc(docRef, data);
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

  return (
    <>
      <ToastContainer autoClose={2000} />
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
                required
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
            <div id="label_titulo_afazer">
              <label>Título</label>
              <input
                type="text"
                name="titulo_afazer"
                id="titulo_afazer"
                value={tituloAfazer}
                required
                onChange={(e) => setTituloAfazer(e.target.value)}
              />
            </div>
            <div id="label_afazer">
              <label>Afazer</label>
              <input
                type="text"
                name="afazer"
                id="afazer"
                value={afazer}
                required
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
    </>
  );
};

export default Modal;
