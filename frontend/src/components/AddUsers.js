import React from "react";

import BtnAddUserNonHover from "../imgs/btnAddUserNonHover.svg";
import BtnAddUserHover from "../imgs/btnAddUserHover.svg";
import ModalAddUsers from "./ModalAddUsers";

const AddUsers = () => {
  const toggleModal = () => {
    let modal = document.querySelector("#modal2");
    let fade = document.querySelector("#fade");
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
  };

  return (
    <>
      <div id="fade" className="hide"></div>
      <ModalAddUsers />
      <div id="container_btnAddUser" onClick={toggleModal}>
        <img
          src={BtnAddUserNonHover}
          id="btn_addUser"
          onMouseOver={(e) => (e.currentTarget.src = BtnAddUserHover)}
          onMouseOut={(e) => (e.currentTarget.src = BtnAddUserNonHover)}
        />
      </div>
    </>
  );
};

export default AddUsers;
