import React from "react";

const dayOfWeek = () => {
  let semana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];

  let d = new Date();
  let element = document.querySelector("#week_day");

  if (element) {
    element.innerText = `${semana[d.getDay()]} - ${d.getDate()}`;
  }
};

const DaysOfWeek = () => {
  return (
    <div>
      <h2 id="week_day">{setTimeout(dayOfWeek, 10)}</h2>
    </div>
  );
};

export default DaysOfWeek;
