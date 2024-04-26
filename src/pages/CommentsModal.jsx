// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useEffect, useState } from "react"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './CommentsModal.css';



// eslint-disable-next-line react/prop-types
export default function CommentsModal({open, articleUrl, handleClose}) {

  const [comments, setComments] = useState([])

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
      </Box>
    </Modal>
  )
}