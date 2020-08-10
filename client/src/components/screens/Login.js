import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
export default function Login() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  // const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = () => {
    if (email === "" || password === "") {
      return M.toast({ html: "Enter all fileds" });
    }
    fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "SUCCESS" });
          history.push("/");
        }
       // console.log(data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Codersgram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light"
          onClick={() => PostData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Not registered yet??</Link>
        </h5>
      </div>
    </div>
  );
}
