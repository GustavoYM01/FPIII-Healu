import { NavLink } from "react-router-dom";

import ClipBoard from "../imgs/NewSvgs/Clipboard.svg";
import Chat2 from "../imgs/NewSvgs/Chat.svg";
import Call2 from "../imgs/NewSvgs/Call.svg";

import SelectedClipBoard from "../imgs/NewSvgs/SelectedClipboard.svg";
import SelectedChat2 from "../imgs/NewSvgs/SelectedChat.svg";

function changeIcon(domImg, srcImage) {
  let img = new Image();
  img.onload = function () {
    domImg.src = this.src;
  };
  img.src = srcImage;
}

const MenuNavigation = ({ hrefPage }) => {
  function toggleIcon() {
    let urlPage = hrefPage;
    const urlPageSplit = urlPage.split("/");

    const clipBoard = document.getElementById("todolist");
    const chat = document.getElementById("chat");

    const selectedClipBoard = SelectedClipBoard;
    const selectedChat = SelectedChat2;

    if (urlPageSplit[3] === "lista") {
      changeIcon(clipBoard, selectedClipBoard);
    } else if (urlPageSplit[3] === "chat") {
      changeIcon(chat, selectedChat);
    }
  }

  setTimeout(toggleIcon, 20);

  return (
    <nav className="menu_navigation">
      <ul>
        <li>
          <NavLink to="/lista">
            <img id="todolist" src={ClipBoard} alt="Lembretes" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat">
            <img id="chat" src={Chat2} alt="Chat" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <img id="call" src={Call2} alt="Ligação" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MenuNavigation;
