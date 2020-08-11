import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
export default function Home() {
  const [data, Setdata] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/api/getAllPost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        Setdata(result.post);
        console.log(result.post);
      });
  }, []);
  const likePost = (id) => {
    fetch("/api/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result);
        const newdata = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        Setdata(newdata);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (id) => {
    fetch("/api/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newdata = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        Setdata(newdata);
      })
      .catch((err) => console.log(err));
  };
  const makecomment = (text, postId) => {
    fetch("/api/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //  console.log(result);
        const newdata = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        Setdata(newdata);
      })
      .catch((err) => console.log(err));
  };
  const deletepost = (postId) => {
    fetch(`/api/deletepost/${postId}`, {
      method: "delete",
      headers: {
        // "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newdata = data.filter((item) => {
          return item._id !== result._id;
        });
        Setdata(newdata);
      });
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{}}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                <img
                  src={item.postedBy.photo}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "80px",
                    marginLeft: "20px",
                    marginRight: "10px",
                    marginTop: "10px",
                  }}
                  className="circle responsive-img"
                />
                {item.postedBy.name.toUpperCase()}
              </Link>

              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => deletepost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>

            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              {/* <i className="material-icons">favorite</i> */}
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => unlikePost(item._id)}
                  style={{ color: "red", fontSize: "48px" }}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(item._id)}
                  style={{ color: "black", fontSize: "48px" }}
                >
                  favorite_border
                </i>
              )}
              <h6>{item.likes.length} LIKES</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}📩
                    </span>
                    {record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makecomment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="Add Comment.." />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
