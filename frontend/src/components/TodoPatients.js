import React from "react";

const TodoPatients = ({ todo }) => {
  return (
    <div className="todo">
      <p>Horário: {todo.horario}</p>
      <p>Afazer: {todo.afazer}</p>
      <p>Paciente: {todo.paciente}</p>
    </div>
  );
};

export default TodoPatients;
