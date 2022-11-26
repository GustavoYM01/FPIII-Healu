import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { NavLink } from "react-router-dom";
import Img from "../imgs/user.svg";

const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  const hrefPage = window.location.href;
  const urlPageSplit = hrefPage.split("/");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <NavLink
      to={`${urlPageSplit[3] === "lista" ? "#" : "/chat"}`}
      className={`${urlPageSplit[3] === "lista" ? "nonLink" : ""}`}
    >
      <div
        className={`user_wrapper ${
          urlPageSplit[3] === "chat" && chat.userName === user.userName
            ? "selected_user"
            : urlPageSplit[3] === "lista"
            ? "default"
            : ""
        }`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img
              className="avatar"
              src={user.avatar ? user.avatar : Img}
              alt="avatar"
            />
            <p id="text_userName">{user.userName}</p>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">Nova msg</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Eu:" : null}</strong>
            {data.text}
          </p>
        )}
      </div>
    </NavLink>
  );
};

export default User;
