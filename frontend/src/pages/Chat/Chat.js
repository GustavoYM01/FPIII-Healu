import { useEffect, useState } from "react";
import { db, auth, storage } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import MenuNavigation from "../../components/MenuNavigation";
import Navbar from "../../components/Navbar";
import User from "../../components/User";
import MessageForm from "../../components/MessageForm";
import Message from "../../components/Message";
import ArrowLeft from "../../imgs/arrowLeft.svg";
import ArrowRight from "../../imgs/arrowRight.svg";

const Chat = () => {
  let hrefPage = window.location.href;

  const sideBar = document.querySelector(".sidebar");
  const btnToggle = document.querySelector(".btn_toggle");
  const menuNav = document.querySelector(".menu_navigation");
  const arrowIcon = document.querySelector(".arrow_icon");
  const arrowUpDown = document.querySelector(".arrowUpDown");
  const user_wrapperSelectedUser = document.querySelector(
    ".user_wrapper.selected_user"
  );

  if (user_wrapperSelectedUser) {
    if (sideBar && btnToggle && menuNav && arrowIcon && arrowUpDown) {
      arrowUpDown.style.opacity = "1";
      menuNav.classList.remove("small");
      arrowIcon.src = ArrowRight;
      sideBar.style.marginLeft = "-15em";
      menuNav.style.opacity = "1";
      menuNav.style.pointerEvents = "all";
      btnToggle.style.marginLeft = "-15em";
    }
  }

  const [msgs, setMsgs] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [prof, setProf] = useState([]);
  const [profSaude, setProfSaude] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");

  const user1 = auth.currentUser.uid;
  const currentUser = user1;
  let nomeProfSaude = [];

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

  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    if (docSnap.data().from !== user1) {
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    setText("");
  };

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
    <div className="center_container">
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
          {profSaude.length > 0 &&
          profSaude[0].isHealthProfessional === false ? (
            <>
              {prof.map((prof) => (
                <User
                  key={prof.uid}
                  user={prof}
                  selectUser={selectUser}
                  user1={user1}
                  chat={chat}
                />
              ))}
            </>
          ) : (
            <>
              {pacientes.map((paciente) => (
                <User
                  key={paciente.uid}
                  user={paciente}
                  selectUser={selectUser}
                  user1={user1}
                  chat={chat}
                />
              ))}
            </>
          )}
        </>
      </div>
      <MenuNavigation hrefPage={hrefPage} />
      <Navbar />
      {window.innerHeight <= 700 ? (
        <div className="messages_container mobile">
          {chat ? (
            <>
              <div className="messages_user">
                <h3>{chat.userName}</h3>
              </div>
              <div className="messages">
                {msgs.length
                  ? msgs.map((msg, i) => (
                      <Message key={i} msg={msg} user1={user1} />
                    ))
                  : null}
              </div>
              <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
              />
            </>
          ) : (
            <h3 className="no_conv">
              Selecione algum usuário para iniciar uma conversa
            </h3>
          )}
        </div>
      ) : (
        <div className="messages_container">
          {chat ? (
            <>
              <div className="messages_user">
                <h3>{chat.userName}</h3>
              </div>
              <div className="messages">
                {msgs.length
                  ? msgs.map((msg, i) => (
                      <Message key={i} msg={msg} user1={user1} />
                    ))
                  : null}
              </div>
              <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
              />
            </>
          ) : (
            <h3 className="no_conv">
              Selecione algum usuário para iniciar uma conversa
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
