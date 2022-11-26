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

const ModalAddUsers = () => {
  const [users, setUsers] = useState([]);
  const [busca, setBusca] = useState("");

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

  const toggleModal = () => {
    let modal = document.querySelector("#modal2");
    let fade = document.querySelector("#fade");
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
  };

  const handleSubmit = async (e) => {};

  return (
    <div id="modal2" className="hide">
      <div className="modal_header">
        <h3>Adicione usuários</h3>
        <button id="btn_fecharModal" onClick={toggleModal}>
          X
        </button>
      </div>
      <div class="modal_body">
        <form id="form_addUsers" onSubmit={handleSubmit}>
          <div id="container_search">
            <input
              type="search"
              onChange={(e) => {
                setBusca(e.target.value);
              }}
            />
          </div>
          <div id="container_preSearch">
            {users
              .filter((val) => {
                if (busca === "") {
                  return val;
                } else if (
                  val.userName.toLowerCase().includes(busca.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((user) => (
                <User key={user.uid} user={user} />
              ))}
          </div>
          <div id="container_confirmAddUser">
            <input id="btn_confirmAddUser" type="submit" value="Enviar" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddUsers;
