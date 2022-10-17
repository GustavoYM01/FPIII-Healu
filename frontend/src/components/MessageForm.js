import Attachment from "./svg/Attachment";
import PaperPlane from "../imgs/paperPlane.svg";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  const msgInp = document.querySelector("#inp_msg");
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          id="inp_msg"
          type="text"
          placeholder="Digite a mensagem"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        {msgInp && msgInp.value.length === 0 ? (
          <>
            <img id="enter_msg" src={PaperPlane} alt="Ícone enviar msg" />
            <input
              id="btn"
              className="disabled"
              type="submit"
              value=""
              disabled
            />
          </>
        ) : (
          <>
            <img
              id="enter_msg"
              src={PaperPlane}
              alt="Ícone enviar msg"
              onClick={handleSubmit}
            />
            <input id="btn" type="submit" value="" />
          </>
        )}
      </div>
    </form>
  );
};

export default MessageForm;
