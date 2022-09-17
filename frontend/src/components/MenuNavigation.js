import { NavLink } from "react-router-dom";

import TodoList from "../imgs/calendar.svg";
import Chat from "../imgs/message-square.svg";
import Call from "../imgs/phone.svg";

import SelectedTodoList from "../imgs/calendar_selected.svg";
import SelectedChat from "../imgs/message-square_selected.svg";
// import SelectedCall from "../imgs/phone_selected.svg";

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

    const todoListImg = document.getElementById("todolist");
    const ChatImg = document.getElementById("chat");
    // const CallImg = document.getElementById("call");

    const todoList = SelectedTodoList;
    const chat = SelectedChat;
    // const call = SelectedCall;

    if (urlPageSplit[3] === "lista") {
      changeIcon(todoListImg, todoList);
    } else if (urlPageSplit[3] === "chat") {
      changeIcon(ChatImg, chat);
    } /* else if (urlPageSplit[3] === "/") {
      changeIcon(CallImg, call);
    } */
  }

  setTimeout(toggleIcon, 20);

  return (
    <nav className="menu_navigation">
      <ul>
        <li>
          <NavLink to="/lista">
            <img id="todolist" src={TodoList} alt="Lembretes" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat">
            <img id="chat" src={Chat} alt="Chat" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <img id="call" src={Call} alt="Ligação" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MenuNavigation;
