import Back from "../../imgs/backward.svg";
import PaperPlane from "../../imgs/paperPlane.svg";

import { useState } from "react";

const Call = () => {
  const roomNm = document.querySelector("#inpt_room");
  const [room, setRoom] = useState(null);

  const handleSubmit = () => {
    window.location.assign(`/video/${room}`);
  };

  return (
    <div className="center_container">
      <a id="return" href="/lista">
        <img id="backward" src={Back} alt="Retornar" />
      </a>
      {window.innerWidth > 500 ? (
        <div className="input_roomName">
          <input
            id="inpt_room"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Insira o nome da sala virtual"
          />
          {roomNm && roomNm.value !== "" ? (
            <>
              <img
                id="enter_msg2"
                src={PaperPlane}
                alt="Ícone enviar msg"
                onClick={handleSubmit}
              />
              <input id="btn" type="submit" value="" />
            </>
          ) : (
            <>
              <img
                id="enter_msg2"
                className="disabled"
                src={PaperPlane}
                alt="Ícone enviar msg"
              />
              <input
                id="btn"
                className="disabled"
                type="submit"
                value=""
                disabled
              />
            </>
          )}
        </div>
      ) : (
        <div className="input_roomNameMobile">
          <input
            type="text"
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Insira um nome para a sala virtual"
          />
          <div>
            <button onClick={handleSubmit}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Call;
