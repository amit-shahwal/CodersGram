import React, { useEffect, useState, useContext } from "react";
import "../../App.css";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const Profile = () => {
  const [userProfile, setProfile] = useState();
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowfollow] = useState();

  useEffect(() => {
    fetch(`/api/user/${userid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setProfile(data);
        const st = JSON.parse(localStorage.getItem("user"));
        if (!st.following.includes(userid)) {
          setShowfollow(true);
        } else {
          setShowfollow(false);
        }
      });
  }, []);
  const followUser = () => {
    fetch(`/api/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });

        //console.log(data);
        setShowfollow(false);
        // console.log(state);
      });
  };
  const unfollowUser = () => {
    fetch(`/api/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ unfollowId: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });

        // console.log(data);
        // console.log(state);
        setShowfollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.photo}
              />
            </div>
            <div>
              <h4>{userProfile.user.name.toUpperCase()}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.post.length}post</h6>
                <h6>{userProfile.user.followers.length}followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {showfollow ? (
                <button
                  className="btn waves-effect waves-light"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.post.map((pic) => {
              return <img className="item" key={pic._id} src={pic.photo} />;
            })}
          </div>
        </div>
      ) : (
        <h5>LOADING...</h5>
      )}
    </>
  );
};
export default Profile;
