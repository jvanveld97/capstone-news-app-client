/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import "./TopicList.css"
import globeImage from '../assets/globe 2.png';
import TextField from '@mui/material/TextField'
import SummarizeIcon from '@mui/icons-material/Summarize'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'


export const TopicList = () => {
  const [topicsAndArticles, setTopicsAndArticles] = useState([])
  const [newTopicName, setNewTopicName] = useState("")
  const [topics, setTopics] = useState([])
  const articlesContainerRefs = useRef([])
  const [summarizedText, setSummarizedText] = useState('')
  const [openSummaryPopup, setOpenSummaryPopup] = useState(false)

  const CACHE_KEY = "topicsAndArticles"
  const CACHE_EXPIRATION_TIME = 10800000 // 3 hours in milliseconds

  const fetchTopicsForUser = async () => {
    const response = await fetch("http://localhost:8000/topics", {
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("news_token")).token
        }`,
      },
    })
    if (response.ok) {
      const topicsArrayForUser = await response.json()
      // Update your state with the fetched topics and articles
      setTopics(topicsArrayForUser)
    }
  }

  useEffect(() => {
    fetchTopicsForUser()
  }, [])

  const fetchTopicsAndArticles = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY)
      const cachedTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`)

      if (
        cachedData &&
        cachedTimestamp &&
        Date.now() - cachedTimestamp < CACHE_EXPIRATION_TIME
      ) {
        // Use the cached data
        const cachedTopicsWithArticles = JSON.parse(cachedData)

        // Filter the articles before setting the state
        const filteredTopicsWithArticles = cachedTopicsWithArticles.map(
          (topic) => ({
            ...topic,
            articles: topic.articles.filter(
              (article) => article.url !== "https://removed.com"
            ),
          })
        )
        // Use the cached data
        setTopicsAndArticles(filteredTopicsWithArticles)
        return
      }

      // Proceed with the API request if the cache is invalid or expired
      const response = await fetch("http://localhost:8000/topics/articles", {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("news_token")).token
          }`,
        },
      })

      if (response.ok) {
        const topicsWithArticles = await response.json()

        // Filter the articles before setting the state
        const filteredTopicsWithArticles = topicsWithArticles.map((topic) => ({
          ...topic,
          articles: topic.articles.filter(
            (article) => article.url !== "https://removed.com"
          ),
        }))

        // Update your state with the fetched topics and articles
        setTopicsAndArticles(filteredTopicsWithArticles)

        // Cache the fetched data and the current timestamp
        localStorage.setItem(CACHE_KEY, JSON.stringify(topicsWithArticles))
        localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now())
      } else {
        // Handle error
        console.error("Failed to fetch topics and articles")
      }
    } catch (error) {
      console.error("Error fetching topics and articles:", error)
    }
  }, [])

useEffect(() => {
  fetchTopicsAndArticles();
}, [fetchTopicsAndArticles]);

const handleMouseMove = useCallback(
  (e, index) => {
    const articlesContainer = articlesContainerRefs.current[index];
    if (articlesContainer && articlesContainer.contains(e.target)) {
      articlesContainer.scrollLeft += e.deltaY;
      e.preventDefault(); // Prevent vertical scrolling when over the articles container
    }
  },
  [articlesContainerRefs]
);

const handleMouseLeave = useCallback(
  (index) => {
    const articlesContainer = articlesContainerRefs.current[index];
    if (articlesContainer) {
      articlesContainer.removeEventListener("wheel", (e) =>
        handleMouseMove(e, index)
      );
      articlesContainer.removeEventListener("mouseleave", () =>
        handleMouseLeave(index)
      );
    }
  },
  [handleMouseMove]
);

useEffect(() => {
  const attachEventListeners = () => {
    if (articlesContainerRefs.current) {
      articlesContainerRefs.current.forEach((ref, index) => {
        const articlesContainer = ref;
        if (articlesContainer) {
          articlesContainer.addEventListener("wheel", (e) =>
            handleMouseMove(e, index)
          );
          articlesContainer.addEventListener("mouseleave", () =>
            handleMouseLeave(index)
          );
        }
      });
    }
  };

  attachEventListeners();

  return () => {
    if (articlesContainerRefs.current) {
      articlesContainerRefs.current.forEach((ref, index) => {
        const articlesContainer = ref;
        if (articlesContainer) {
          articlesContainer.removeEventListener("wheel", (e) =>
            handleMouseMove(e, index)
          );
          articlesContainer.removeEventListener("mouseleave", () =>
            handleMouseLeave(index)
          );
        }
      });
    }
  };
}, [handleMouseMove, handleMouseLeave]);

  const handleCreateTopic = async (topicName) => {
    try {
      const response = await fetch("http://localhost:8000/topics", {
        method: "POST",
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("news_token")).token
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: topicName }),
      })

      if (response.ok) {
        // Topic created successfully
        // Invalidate the cache
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(`${CACHE_KEY}_timestamp`)
        fetchTopicsAndArticles()
        setNewTopicName("")
      } else {
        // Handle error
        console.error("Failed to create topic")
      }
    } catch (error) {
      console.error("Error creating topic:", error)
    }
  }

  const handleDeleteTopic = async (topicName) => {
    try {
      // Find the topic with the matching name
      const topicToDelete = topics.find((topic) => topic.name === topicName)

      if (topicToDelete) {
        const response = await fetch(
          `http://localhost:8000/topics/${topicToDelete.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${
                JSON.parse(localStorage.getItem("news_token")).token
              }`,
            },
          }
        )

        if (response.ok) {
          // Topic deleted successfully
          // Invalidate the cache
          localStorage.removeItem(CACHE_KEY)
          localStorage.removeItem(`${CACHE_KEY}_timestamp`)

          fetchTopicsForUser() // Update the topics list after successful deletion
          fetchTopicsAndArticles() // Update the topics and articles list after successful deletion
        } else {
          // Handle error
          console.error("Failed to delete topic")
        }
      } else {
        console.error("Topic not found")
      }
    } catch (error) {
      console.error("Error deleting topic:", error)
    }
  }

  // Styled IconButton component
  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }))

  const handleSummarizeArticle = async (articleUrl) => {
    try {
      const response = await fetch(`http://localhost:8000/summarizer`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("news_token")).token
          }`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleUrl }),
      });
  
      const data = await response.json();
      setSummarizedText(data.choices[0].message.content)
      setOpenSummaryPopup(true);
    } catch (error) {
      console.error('Error summarizing article:', error);
    }
  }

  return (
    <div style={{ padding: "80px" }}>
      {topicsAndArticles.map((topicData, index) => (
        <div key={topicData.topic} style={{ marginBottom: "30px" }}>
          <Typography variant="h2" style={{ marginBottom: "20px" }}>
            {topicData.topic}{" "}
            <Button
              onClick={() => handleDeleteTopic(topicData.topic)}
              sx={{ color: "red" }}
            >
              Delete Topic
            </Button>
          </Typography>

          <Box
            sx={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              maxHeight: 385,
            }}
            ref={(el) => (articlesContainerRefs.current[index] = el)}
          >
            {topicData.articles.map((article, articleIndex) => (
              <Card
                key={articleIndex}
                sx={{
                  display: "inline-block",
                  marginRight: 2,
                  width: 400,
                  height: 360,
                  position: "relative"
                }}
              >
                <CardActionArea>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "56.25%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={article.url_to_image || globeImage}
                      alt={article.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      //   className="scrolling-text" // Add classes for scrolling animation
                      sx={{
                        fontSize: "0.9rem",
                        whiteSpace: "normal",
                      }}
                    >
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {`${article.source_name}: ${article.title}`}
                    </a>
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <IconButton
                    sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    }}
                    color="success"
                    onClick={() => handleSummarizeArticle(article.url)}
                >
                    <SummarizeIcon />
                </IconButton>
              </Card>
            ))}
          </Box>
        </div>
      ))}
      <Box
        sx={{
          marginTop: 4,
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
        }}
      >
        <TextField
          type="text"
          placeholder="Enter new topic name"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          sx={{ width: "100%", marginBottom: 1 }}
        />
        <Button
          onClick={() => handleCreateTopic(newTopicName)}
          variant="contained"
          color="primary"
          sx={{ width: "100%" }}
        >
          Create Topic
        </Button>
      </Box>
      <Dialog
        open={openSummaryPopup}
        onClose={() => setOpenSummaryPopup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="body1">{summarizedText}</Typography>
        </DialogContent>
      </Dialog>
    </div>
  )
}