// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useEffect, useState } from "react"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'
import './CommentsModal.css';
import { Button } from '@mui/material';



// eslint-disable-next-line react/prop-types
export default function CommentsModal({open, articleUrl, handleClose, currentUser}) {


  const initialNewCommentState = {
    user: currentUser.user_id,
    article_url: "",
    comment: ""
}

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState(initialNewCommentState)



  const fetchCommentsFromApi = async (articleUrl) => {
    let url = `http://localhost:8000/comments?article_url=${articleUrl}`
  
    const response = await fetch(url, {
        headers: {
            Authorization: `Token ${JSON.parse(localStorage.getItem("news_token")).token}`
        }
    })
    const commentData = await response.json()
    setComments(commentData)
  }
  useEffect(() => {
    if (open && articleUrl) {
      fetchCommentsFromApi(articleUrl);
    }
  }, [open, articleUrl])

  // useEffect hook to update newComment.article_url when articleUrl changes
  useEffect(() => {
    if (articleUrl) {
      setNewComment((prevState) => ({
        ...prevState,
        article_url: articleUrl,
      }));
    }
  }, [articleUrl])

  const handleCommentChange = (event) => {
    setNewComment({
      ...newComment,
      comment: event.target.value
    });
  }
  

  const createComment = async (event) => {
    event.preventDefault()

    await fetch(`http://localhost:8000/comments`, {
      method: "POST",
      headers: {
        "Authorization": `Token ${JSON.parse(localStorage.getItem("news_token")).token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newComment)
    })
    await fetchCommentsFromApi(articleUrl)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-container">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Discussion Board
        </Typography>
        <div className="comments-board">
          {comments.map((comment, index) => (
            <div key={index} className="comment-container">
              <Typography variant="body1">{comment.comment}</Typography>
              <Typography variant="caption" color="textSecondary">
                Posted by User {comment.user} on {new Date(comment.created_at).toLocaleString()}
              </Typography>
            </div>
          ))}
        </div>
        <div>
          <TextField
            id="outlined-multiline-static"
            label="New Comment"
            multiline
            rows={6}
            // value={newComment}
            onChange={handleCommentChange}
          />
          <Button onClick={createComment}>Post</Button>
        </div>
      </Box>
    </Modal>
  )
}