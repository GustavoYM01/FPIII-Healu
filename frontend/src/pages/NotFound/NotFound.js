import React from "react";

import notFound from "../../imgs/not_found404.svg";

const returnToPreviousPage = () => {
  window.history.back();
};

const NotFound = () => {
  return (
    <div id="not_foundDiv">
      <div id="div_img" onClick={returnToPreviousPage}>
      </div>
      <img src={notFound} alt="Imagem página não encontrada" />
      <div id="text_notFound">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
      </div>
    </div>
  );
};

export default NotFound;
