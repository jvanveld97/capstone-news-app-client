export const deleteComment = async (commentId) => {
  return await fetch(`http://localhost:8000/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${
        JSON.parse(localStorage.getItem("news_token")).token
      }`,
      "Content-Type": "application/json",
    },
  })
}

export const editComment = async (updatedComment) => {
  return await fetch(`http://localhost:8000/comments/${updatedComment.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${
        JSON.parse(localStorage.getItem("news_token")).token
      }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedComment),
  })
}

export const fetchMoods = async () => {
  try {
    const response = await fetch("http://localhost:8000/moods", {
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("news_token")).token
        }`,
      },
    })

    if (response.ok) {
      const moods = await response.json()
      return moods
    } else {
      throw new Error(`HTTP error ${response.status}`)
    }
  } catch (error) {
    console.error("Error fetching moods:", error)
    throw error
  }
}
