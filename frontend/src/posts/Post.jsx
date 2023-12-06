import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import InputEmoji from 'react-input-emoji';

const Post = () => {
  const [decoded, setDecoded] = useState(null);
  const [post, setPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);



  const { id } = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    getPost();
    getComments();
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecoded(decodedToken);
      setIsLoggedIn(true); // Set login status to true if token exists

    }
  }, []);

  const getPost = async () => {
    try {
      const response = await axios.get(`${server_url}/posts/${id}`);
      const postData = response.data;

      // Splitting the image paths into an array and replacing backslashes with forward slashes
      const imagePaths = postData.image.split(",").map((path) => path.replace('uploads\\', "/"));

      // Updating the postData object to include the imagePaths property
      const updatedPostData = {
        ...postData,
        image: imagePaths,
      };

      setPost(updatedPostData);
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong while fetching the post.");
    }
  };


  const editComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setUpdatedCommentContent("");
  };

  const updateComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.put(
        `${server_url}/comment/${commentId}`,
        {
          content: updatedCommentContent,
        },
        config
      );
      cancelEditComment();
      getComments(); // Refresh the comments after update
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.delete(`${server_url}/comment/${commentId}`, config);
      getComments(); // Refresh the comments after deletion
    } catch (error) {
      console.log(error);
    }
  };




  const deletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.delete(`${server_url}/posts/${id}`, config);
      navigate('/posts')
    } catch (error) {
      console.log(error);
    }
  };


  const browseNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === post.image.length - 1) {
        return 0; // Reached the end, start from the beginning
      } else {
        return prevIndex + 1;
      }
    });
  };

  const browsePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === 0) {
        return post.image.length - 1; // Reached the beginning, go to the last image
      } else {
        return prevIndex - 1;
      }
    });
  };

  const getComments = async () => {
    try {
      const response = await axios.get(
        `${server_url}/posts/${id}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong while fetching the comments.");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();


    if (!isLoggedIn) {
      console.log("User not logged in");
      return;
    }

    const userId = localStorage.getItem("token");

    try {
      const response = await axios.post(`${server_url}/comment/${id}`, {
        content: content,
        userId: userId,
      });
      window.location.reload(true);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container post-container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {post ? (
            <>
              <div className="card post-card">
                <h2 style={{ padding: '20px' }}>{post.name}</h2>
                <div className="card-body">
                  <div className="post-header" style={{ direction: 'rtl' }}>

                    <table className="table">
                      <tbody>

                        <tr>
                          <td>קטגוריה</td>
                          <td>
                            {post.category === 'כלבים' ? '🐶' :
                              post.category === 'חתולים' ? '🐱' :
                                post.category === 'תוכים ובעלי כנף' ? '🦜' :
                                  post.category === 'זוחלים' ? '🐍' :
                                    post.category === 'מכרסמים' ? '🐭' : ''}
                          </td>
                        </tr>
                        <tr>
                          <td>סוג</td>
                          <td>{post.type}</td>
                        </tr>
                        <tr>
                          <td>מין</td>
                          <td>{post.gender}</td>
                        </tr>
                        <tr>
                          <td>מיקום 📍</td>
                          <td>{post.location}</td>
                        </tr>
                        <tr>
                          <td>גיל (בשנים)</td>
                          <td>{post.age}</td>
                        </tr>
                        <tr>
                          <td>מחונך/ת לצרכים</td>
                          <td>{post.isEducated ? '✅' : '❌'}</td>
                        </tr>
                        <tr>
                          <td>מחוסן/ת</td>
                          <td>{post.isImmune ? '✅' : '❌'}</td>
                        </tr>
                        <tr>
                          <td>מסורס / מעוקרת</td>
                          <td>{post.isCastrated ? '✅' : '❌'}</td>
                        </tr>
                        <tr>
                          <td>קצת על בעל החיים</td>
                          <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>
                            {post.description}
                          </td>
                        </tr>

                        <tr>
                          <td>מעלה הפוסט</td>
                          <td>
                            <a href={`/users/${post.author.id}`} className="post-field-value">
                              {post.author.username}
                              <img style={{ height: "50px", width: "50px", borderRadius: "50%", padding: '5px' }} src={`${server_url}/${post.author.image}`} alt="" />
                            </a>
                            <Link to={`/sendmessage/${post.author.id}`}>
                              <button>
                                שלח הודעה📩
                              </button>
                            </Link>
                          </td>

                        </tr>
                        <tr>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="post-image-container">
                    <div className="image-container">
                      <img
                        src={`${server_url}/${post.image[currentImageIndex]}`}
                        alt=""
                        className="post-image"
                      />
                      <div className="image-buttons">
                        <button onClick={browsePreviousImage} className="prev-button">
                          ◀
                        </button>
                        <button onClick={browseNextImage} className="next-button">
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>
                  {decoded && decoded.id && post.author.id === decoded.id && !post.isAdopted && (
                    <div className="post-actions">
                      <Link to={`/edit/${id}`} className="btn btn-info mr-2">
                        Edit
                      </Link>
                      <button onClick={deletePost} className="btn btn-danger">Delete</button>
                    </div>
                  )}


                  <div className="comment-section">
                    <h2 className="mt-5">Comments: {comments.length}</h2>

                    {isLoggedIn ? (
                      <form onSubmit={addComment} className="comment-form">
                        <div className="form-group d-flex align-items-center">
                          <InputEmoji
                            value={content}
                            onChange={setContent}

                            placeholder="Type a message"
                            className="form-control"
                          />
                          <button type="submit" className="btn btn-primary ml-2">
                            Send
                          </button>
                        </div>
                      </form>
                    )
                      : (

                        <div style={{ direction: "rtl", color: "#555", marginBottom: "10px", fontSize: "14px", textAlign: "center" }}>
                          <p style={{ marginBottom: "10px" }}>רק משתמשים רשומים יכולים להגיב</p>
                          <div style={{ margin: "5px" }}>
                            <Link to={"/userLogin"} className="btn btn-primary" style={{ marginRight: "5px", margin: "5px" }}>התחברות</Link>
                            <Link to={"/register"} className="btn btn-primary" style={{ margin: "5px" }}>הרשמה</Link>
                          </div>
                        </div>



                      )}

                    <div className="comment-list mt-4">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment._id} className="comment">
                            <div className="comment-header">
                              <Link
                                to={`/users/${comment.author.id}`}
                              >
                                <img
                                  src={`${server_url}${comment.author.image}`}
                                  alt=""
                                  className="comment-author-img"
                                />
                              </Link>
                              <div className="comment-author-details">
                                <Link
                                  to={`/users/${comment.author.id}`}
                                >
                                  <p className="comment-author-username">
                                    {comment.author.username}
                                  </p>
                                </Link>
                                <p className="comment-author-date">
                                  {new Date(comment.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="comment-content">
                              <p>{comment.content}</p>
                            </div>
                            {decoded && decoded.id && comment.author.id === decoded.id && (
                              <div className="comment-actions">
                                {editingCommentId === comment._id ? (
                                  <>
                                    <input
                                      type="text"
                                      value={updatedCommentContent}
                                      onChange={(e) => setUpdatedCommentContent(e.target.value)}
                                    />
                                    <button
                                      onClick={() => updateComment(comment._id)}
                                      className="btn btn-success btn-sm btn-update"
                                    >
                                      <span role="img" aria-label="Save">
                                        💾
                                      </span>
                                    </button>
                                    <button
                                      onClick={cancelEditComment}
                                      className="btn btn-secondary btn-sm btn-cancel"
                                    >
                                      <span role="img" aria-label="Cancel">
                                        ❌
                                      </span>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => editComment(comment._id)}
                                      className="btn btn-info btn-sm btn-edit"
                                    >
                                      <span role="img" aria-label="Edit">
                                        ✏️
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => deleteComment(comment._id)}
                                      className="btn btn-danger btn-sm btn-delete"
                                    >
                                      <span role="img" aria-label="Delete">
                                        🗑️
                                      </span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="mt-3">No comments yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
