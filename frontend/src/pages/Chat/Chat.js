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

  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [user1]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
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

  const sideBar = document.querySelector(".sidebar");
  const btnToggle = document.querySelector(".btn_toggle");
  const menuNav = document.querySelector(".menu_navigation");
  const arrowIcon = document.querySelector(".arrow_icon");

  const toggleSidebar = () => {
    if (sideBar && btnToggle && menuNav && arrowIcon) {
      arrowIcon.src = ArrowLeft;
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
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <MenuNavigation hrefPage={hrefPage} />
      <Navbar />
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
    </div>
  );
};

export default Chat;
