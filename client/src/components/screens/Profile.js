import React, { useEffect, useState, useContext } from "react";
import "../../App.css";
import M from "materialize-css";

import { UserContext } from "../../App";
const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [image, setImage] = useState("");
  //const [url, setUrl] = useState();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/api/mypost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.mypost);
        setPics(data.mypost);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "cha");
      fetch("https://api.cloudinary.com/v1_1/cha/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            return M.toast({ html: "please provide all fields please" });
          }
          //console.log(data);
          //  setUrl(data.url);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, photo: data.url })
          );
          dispatch({ type: "UPDATEPIC", payload: data.url });
          fetch("/api/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ photo: data.url }),
          })
            .then((res) => res.json())
            .then((result) => {
            //  console.log(result);
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.photo : "LOADING..."}
            />
          </div>
          <div>
            <h4>{state ? state.name.toUpperCase() : "Loading.."}</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{mypics.length} Post</h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>

        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn">
            <span>UPDATE PIC</span>
            <input
              type="file"
              // value={title}
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((pic) => {
          return <img className="item" key={pic._id} src={pic.photo} />;
        })}
      </div>
    </div>
  );
};
export default Profile;
