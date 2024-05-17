/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useEffect, useState } from "react"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import './CommentsModal.css';
import { Button } from '@mui/material';
import { deleteComment, editComment, fetchMoods } from '../components/services/commentFetcher';



// eslint-disable-next-line react/prop-types
export default function CommentsModal({
  open,
  articleUrl,
  handleClose,
  currentUser,
}) {
  const initialNewCommentState = {
    // eslint-disable-next-line react/prop-types
    user: currentUser.user_id,
    article_url: "",
    comment: "",
    mood: {},
  }

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState(initialNewCommentState)
  const [editingComment, setEditingComment] = useState(null)
  const [moods, setMoods] = useState([])
  const [commentText, setCommentText] = useState("")
  const [selectedMood, setSelectedMood] = useState(null)

  const fetchCommentsFromApi = async (articleUrl) => {
    let url = `http://localhost:8000/comments?article_url=${articleUrl}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("news_token")).token
        }`,
      },
    })
    const commentData = await response.json()
    setComments(commentData)
  }

  // Effect hook to fetch comments when the modal is open and the article URL changes
  useEffect(() => {
    if (open && articleUrl) {
      fetchCommentsFromApi(articleUrl)
    }
  }, [open, articleUrl])

  // Effect hook to update the article URL in the new comment state when the articleUrl changes
  useEffect(() => {
    if (articleUrl) {
      setNewComment((prevState) => ({
        ...prevState,
        article_url: articleUrl,
      }))
    }
  }, [articleUrl])

  // Effect hook to fetch available moods from the API
  useEffect(() => {
    const fetchMoodsData = async () => {
      try {
        const moodsData = await fetchMoods()
        setMoods(moodsData)
      } catch (error) {
        console.error("Error fetching moods:", error)
      }
    }
    fetchMoodsData()
  }, [])

  // Function to handle changes in the new comment input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "comment") {
      setCommentText(value);
    } else if (name === "mood") {
      setSelectedMood(value === "" ? null : parseInt(value));
    }
  }

  // Function to set the comment state being edited
  const handleEditComment = (comment) => {
    setEditingComment(comment)
    setNewComment((prevState) => ({
      ...prevState,
      mood: comment.mood ? comment.mood.id : null,
    }))
  }

  // Function to handle deleting a comment
  const handleDeleteComment = async (comment) => {
    try {
      await deleteComment(comment.id) // Pass the comment id
      await fetchCommentsFromApi(articleUrl) // Fetch updated comments after successful deletion
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  // Function to handle updating a comment
  const handleUpdateComment = async () => {
    try {
      const currentDate = new Date() // Get the current date

      // Update the updatedComment object with the current date in ISO string format
      const updatedCommentData = {
        ...editingComment,
        edited_at: currentDate.toISOString(), // Convert the date to ISO string
        mood: editingComment.mood ? editingComment.mood.id : null,
      }
      const response = await editComment(updatedCommentData)

      if (response.ok) {
        setEditingComment(null) // Reset the editing state
        await fetchCommentsFromApi(articleUrl) // Fetch updated comments after successful update
      } else {
        console.error("Error updating comment:", response.status)
      }
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  // Function to handle creating a new comment
  const createComment = async (event) => {
    event.preventDefault();

    try {
      const moodId = selectedMood ? selectedMood : null; // Get the mood ID or null
  
      await fetch(`http://localhost:8000/comments`, {
        method: "POST",
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("news_token")).token
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: currentUser.user_id, // Use currentUser.user_id directly
          article_url: articleUrl, // Use articleUrl directly
          comment: commentText,
          mood: moodId, // Send the mood ID or null
        }),
      });
      await fetchCommentsFromApi(articleUrl);
      setCommentText(""); // Reset commentText
      setSelectedMood(null); // Reset selectedMood
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

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
          {comments.map((comment, index) => {
            const isEditing = editingComment && editingComment.id === comment.id

            return (
              <div key={index} className="comment-container">
                {isEditing ? (
                  <div>
                    <TextField
                      label="Edit Comment"
                      value={editingComment.comment}
                      onChange={(e) =>
                        setEditingComment({
                          ...editingComment,
                          comment: e.target.value,
                        })
                      }
                      fullWidth
                      sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                      select
                      label="Mood"
                      name="mood"
                      value={editingComment?.mood?.id || ""}
                      onChange={(e) =>
                        setEditingComment({
                          ...editingComment,
                          mood: e.target.value
                            ? { id: parseInt(e.target.value) }
                            : null,
                        })
                      }
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="">Select a mood</MenuItem>
                      {moods.map((mood) => (
                        <MenuItem key={mood.id} value={mood.id}>
                          {mood.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button onClick={() => handleUpdateComment(editingComment)}>
                      Save
                    </Button>
                    <Button onClick={() => setEditingComment(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Typography variant="body1">{comment.comment}</Typography>
                    {comment.edited_at === null ? (
                      <Typography variant="caption" color="textSecondary">
                        Posted by User {comment.user} on{" "}
                        {new Date(comment.created_at).toLocaleString()}{" "}
                        {comment.mood
                          ? ` Mood: ${comment.mood.name}`
                          : " Mood: Unknown"}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        Posted by User {comment.user} on{" "}
                        {new Date(comment.edited_at).toLocaleString()}{" "}
                        {comment.mood
                          ? ` Mood: ${comment.mood.name}`
                          : " Mood: Unknown"}
                      </Typography>
                    )}
                    {comment.user === currentUser.user_id && (
                      <div>
                        <Button onClick={() => handleEditComment(comment)}>
                          Edit
                        </Button>
                        <Button onClick={() => handleDeleteComment(comment)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="comment-form-container">
          <TextField
            className="comment-text-field"
            id="outlined-multiline-static"
            label="New Comment"
            name="comment"
            multiline
            rows={4}
            variant="outlined"
            value={commentText}
            onChange={handleChange}
          />

          <TextField
            className="comment-text-field"
            select
            label="Mood"
            name="mood"
            value={selectedMood || ""}
            onChange={handleChange}
            variant="outlined"
          >
            {moods.map((mood) => (
              <MenuItem key={mood.id} value={mood.id}>
                {mood.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            className="comment-button"
            variant="contained"
            color="primary"
            onClick={createComment}
          >
            Post
          </Button>
        </div>
      </Box>
    </Modal>
  )
}