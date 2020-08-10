import React, { useContext } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import "../App.css";
import { UserContext } from "../App";
import M from "materialize-css";

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, {});
});
const NavBar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <NavLink exact activeClassName="active_class" to="/createpost">
            Create-Doubt!
          </NavLink>
        </li>,
        <li>
          <NavLink exact activeClassName="active_class" to="/myfollowerpost">
            Following Post
          </NavLink>
        </li>,
        <li>
          <NavLink exact activeClassName="active_class" to="/">
            DashBoard
          </NavLink>
        </li>,
        <li>
          <NavLink exact activeClassName="active_class" to="/profile">
            PROFILE
          </NavLink>
        </li>,
        <button
          className="btn waves-effect waves-light red"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/login");
          }}
        >
          LOGOUT
        </button>,
      ];
    } else {
      return [
        <li>
          <NavLink exact activeClassName="active_class" to="/login">
            LOGIN
          </NavLink>
        </li>,
        <li>
          <NavLink exact activeClassName="active_class" to="/signup">
            SINGUP
          </NavLink>
        </li>,
      ];
    }
  };
  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo">
            Codersgram♥
          </Link>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">{renderList()}</ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </>
  );
};
export default NavBar;
{
  /* <nav>
<div className="nav-wrapper white ">
  <NavLink to={state ? "/" : "/login"} className="brand-logo left">
    Codersgram♥
  </NavLink>
  <ul id="nav-mobile" className="right">
    {renderList()}
  </ul>
</div>
</nav> */
}
