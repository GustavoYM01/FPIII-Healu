// import UserLogo from "../imgs/user.svg";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import User from "./User";

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");

  useEffect(() => {
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

  const selectUser = (user) => {
    setChat(user);
    // console.log(user);
  };

  return (
    <div className="sidebar">
      {users.map((user) => (
        <User key={user.uid} user={user} selectUser={selectUser} />
      ))}
    </div>
  );
};

export default Sidebar;
