import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { setDoc, query, collection, where, getDocs } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { doc } from "firebase/firestore";
import { db, auth } from "../firebase/config";

export default function FormDialog(props) {
  const currentUser = auth.currentUser.uid;

  const [horario, setHorario] = useState("");
  const [tituloAf, setTituloAf] = useState("");
  const [afazer, setAfazer] = useState("");
  const [paciente, setPaciente] = useState("");
  const [user, setUser] = useState([]);

  let arrayUser = [];

  useEffect(() => {
    // Para validação do login (ver se é ou não, um profissional da saúde)
    const teste = async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "in", [currentUser])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        arrayUser.push(doc.data());
      });
      setUser(arrayUser);
    };
    teste();
  }, []);

  const handleEdit = async () => {
    try {
      const docRef = doc(db, "to-doPatients", props.id_key);
      let data = {
        uid: props.id_key,
        horario: horario || props.horario,
        tituloAfazer: tituloAf || props.tAfazer,
        afazer: afazer || props.afazer,
        paciente: paciente || props.paciente,
        createdAt: props.criado,
        from: currentUser,
        responsavel: props.responsavel,
      };
      setDoc(docRef, data);
      toast.success("Afazer editado com sucesso!");
      function reloadPage() {
        window.location.reload();
      }
      setTimeout(reloadPage, 3300);
      handleClose();
    } catch (error) {
      console.log(`${error}` || `${error.message}`);
      toast.error("Erro, por favor tente mais tarde");
    }
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>Dados afazer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="criado_edit"
            label="Criado em"
            type="text"
            defaultValue={props.criado}
            fullWidth
            variant="standard"
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            id="criado_edit"
            label="Responsável"
            type="text"
            defaultValue={props.responsavel}
            fullWidth
            variant="standard"
            disabled
          />
          {user.length > 0 && user[0].isHealthProfessional !== false ? (
            <TextField
              autoFocus
              margin="dense"
              id="horario_edit"
              label="Horário"
              type="time"
              defaultValue={props.horario}
              fullWidth
              variant="standard"
              onChange={(e) => setHorario(e.target.value)}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              id="horario_edit"
              label="Horário"
              type="time"
              defaultValue={props.horario}
              fullWidth
              variant="standard"
              onChange={(e) => setHorario(e.target.value)}
              disabled
            />
          )}
          {user.length > 0 && user[0].isHealthProfessional !== false ? (
            <TextField
              autoFocus
              margin="dense"
              id="tituloAf_edit"
              label="Título afazer"
              type="text"
              defaultValue={props.tAfazer}
              fullWidth
              variant="standard"
              onChange={(e) => setTituloAf(e.target.value)}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              id="tituloAf_edit"
              label="Título afazer"
              type="text"
              defaultValue={props.tAfazer}
              fullWidth
              variant="standard"
              onChange={(e) => setTituloAf(e.target.value)}
              disabled
            />
          )}
          {user.length > 0 && user[0].isHealthProfessional !== false ? (
            <TextField
              autoFocus
              margin="dense"
              id="afazer_edit"
              label="Afazer"
              type="text"
              defaultValue={props.afazer}
              fullWidth
              variant="standard"
              onChange={(e) => setAfazer(e.target.value)}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              id="afazer_edit"
              label="Afazer"
              type="text"
              defaultValue={props.afazer}
              fullWidth
              variant="standard"
              onChange={(e) => setAfazer(e.target.value)}
              disabled
            />
          )}
          {user.length > 0 && user[0].isHealthProfessional !== false ? (
            <TextField
              autoFocus
              margin="dense"
              id="paciente_edit"
              label="Paciente"
              type="text"
              defaultValue={props.paciente}
              fullWidth
              variant="standard"
              onChange={(e) => setPaciente(e.target.value)}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              id="paciente_edit"
              label="Paciente"
              type="text"
              defaultValue={props.paciente}
              fullWidth
              variant="standard"
              onChange={(e) => setPaciente(e.target.value)}
              disabled
            />
          )}
        </DialogContent>
        <DialogActions>
          {user.length > 0 && user[0].isHealthProfessional !== false ? (
            <Button onClick={handleClose} color="error">
              Cancelar
            </Button>
          ) : (
            <Button onClick={handleClose} color="error">
              X
            </Button>
          )}
          {user.length > 0 && user[0].isHealthProfessional !== false ? (
            <Button onClick={handleEdit} color="primary">
              Salvar
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
}
