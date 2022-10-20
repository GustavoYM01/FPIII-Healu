import Back from "../../imgs/backward.svg";

import { useState } from "react";

const Call = () => {
  const [room, setRoom] = useState(null);

  const handleSubmit = () => {
    window.location.assign(`/video/${room}`);
  };

  return (
    <div className="center_container">
      <a id="return" href="/lista">
        <img id="backward" src={Back} alt="Retornar" />
      </a>
      {window.innerWidth > 1000 ? (
        <div className="input_roomName">
          <input
            type="text"
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Insira um nome para a sala virtual"
          />
          <button onClick={handleSubmit}>Enviar</button>
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
