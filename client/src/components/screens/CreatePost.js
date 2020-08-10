import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
export default function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    //console.log("url", url);
    if (url) {
      fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ title, body, photo: url }),
      })
        .then((res) => res.json())
        .then((data) => {
        //  console.log(data);
          if (data.error) {
            M.toast({ html: data.error });
          } else {
            M.toast({ html: "UPLOADED!!" });
            history.push("/");
          }
        //  console.log(data);
        })
        .catch((error) => console.log(error));
    }
  }, [url]);
  const postDetails = () => {
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
       // console.log(data);
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title/Langauage"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Question or Doubt??"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn">
          <span>Upload image</span>
          <input
            type="file"
            // value={title}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light blue darken-1"
        onClick={() => postDetails()}
      >
        Submit post
        <i className="material-icons right ">send</i>
      </button>
    </div>
  );
}
