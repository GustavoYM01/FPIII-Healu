import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage, db, auth } from "../../firebase/config";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Img from "../../imgs/user.svg";
import Back from "../../imgs/backward.svg";
import Camera from "../../components/svg/Camera";
import Delete from "../../components/svg/Delete";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          console.log(url);
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImg = async () => {
    try {
      const confirm = window.confirm("Deseja excluir a img de perfil?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/lista");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return user ? (
    <section>
      <a id="return" href="/lista">
        <img id="backward" src={Back} alt="Retornar" />
      </a>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar ? user.avatar : Img} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImg={deleteImg} /> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user.userName}</h3>
          <p>{user.email}</p>
          <hr />
          <small>
            Está conosco desde: {user.createdAt.toDate().toLocaleDateString()}
          </small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
