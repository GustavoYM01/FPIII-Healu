import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import {
  doc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormDialog from "./Dialog";

const TodoPatients = ({ todo }) => {
  const currentUser = auth.currentUser.uid;

  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);

  let arrayUser = [];

  useEffect(() => {
    // Para validação do login (ver se é ou não, um profissional da saúde)
    const teste = async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "in", [currentUser])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        arrayUser.push(doc.data());
      });
      setUser(arrayUser);
    };
    teste();
  }, []);

  const handleClickEdit = () => {
    setOpen(true);
  };

  const handleDel = async (param) => {
    try {
      await deleteDoc(doc(db, "to-doPatients", param.uid));
      toast.success("Afazer deletado com sucesso!");
      function reloadPage() {
        window.location.reload();
      }
      setTimeout(reloadPage, 3300);
    } catch (error) {
      console.log(`${error}` || `${error.message}`);
      toast.error("Erro, por favor tente mais tarde");
    }
  };

  return (
    <div>
      <FormDialog
        open={open}
        setOpen={setOpen}
        id_key={todo.uid}
        horario={todo.horario}
        tAfazer={todo.tituloAfazer}
        afazer={todo.afazer}
        paciente={todo.paciente}
        criado={todo.createdAt}
        responsavel={todo.responsavel}
      />
      <div className="todo" data-id={todo.uid} key={todo.uid}>
        <ToastContainer autoClose={2000} />
        <div id="horario">
          <span>{todo.horario}</span>
        </div>
        <div id="todo_afazer">
          <p>{todo.tituloAfazer}</p>
          <span id="desc">{todo.afazer}</span>
        </div>
        <div id="paciente">
          <p>Paciente</p>
          <span id="nome_pac">{todo.paciente}</span>
        </div>
        {user.length > 0 && user[0].isHealthProfessional !== false ? (
          <button id="btn_excluir" onClick={() => handleDel(todo)}>
            Deletar
          </button>
        ) : null}
        <div id="details" onClick={() => handleClickEdit()}>
          <div>.</div>
          <div>.</div>
          <div>.</div>
        </div>
      </div>
    </div>
  );
};

export default TodoPatients;
