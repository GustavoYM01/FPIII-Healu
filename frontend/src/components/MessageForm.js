import Attachment from "./svg/Attachment";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
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
          type="text"
          placeholder="Digite a mensagem"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <input id="btn" type="submit" />
      </div>
    </form>
  );
};

export default MessageForm;
