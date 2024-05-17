import { useEffect, useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { createSvgIcon } from '@mui/material/utils'
import CommentsModal from "./CommentsModal";
import './ArticleList.css';
import { useFetchArticles } from "../components/services/articleFetcher";
import { SearchQueryContext } from "./SearchQueryContext"; 
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import globeImage from '../assets/globe 2.png';
import SummarizeIcon from '@mui/icons-material/Summarize'


// eslint-disable-next-line react/prop-types
export const ArticleList = ({ currentUser, category }) => {
  // const [articles, setArticles] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedArticleUrl, setSelectedArticleUrl] = useState(null)
  const { searchQuery } = useContext(SearchQueryContext)
  const articles = useFetchArticles(category, searchQuery)
  const [summarizedText, setSummarizedText] = useState('')
  const [openSummaryPopup, setOpenSummaryPopup] = useState(false)

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  )

  // Styled IconButton component
  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }))


  const handleModalOpen = (articleUrl) => {
    setSelectedArticleUrl(articleUrl)
    setOpenModal(true)
  }
  const handleModalClose = () => setOpenModal(false)

  // Function to handle saving an article
  const handleSaveArticle = async (articleData) => {
    await fetch(`http://localhost:8000/saved_articles`, {
      method: "POST",
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("news_token")).token
        }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article: articleData }),
    })
  }

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
    <div style={{ padding: "23px" }} className="article-list-container">
      {articles &&
        articles.map((article, index) => (
          <Card key={index} className="article-card">
            <CardMedia
              component="img"
              alt={article.title}
              height="140"
              image={article.url_to_image || globeImage}
            />
            <div className="card-content">
              <div className="article-details" style={{ padding: "16px" }}>
                <Typography gutterBottom variant="h5" component="div">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {article.description}
                </Typography>
              </div>
              <CardActions className="card-actions">
                <Button
                  size="small"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleModalOpen(article.url)}
                >
                  Comment
                </Button>
                <StyledIconButton onClick={() => handleSaveArticle(article)}>
                  <PlusIcon />
                </StyledIconButton>
                <IconButton color="success" onClick={() => handleSummarizeArticle(article.url)}>
                  <SummarizeIcon />
                </IconButton>
              </CardActions>
            </div>
          </Card>
        ))}
      <CommentsModal
        open={openModal}
        currentUser={currentUser ? currentUser : null}
        handleClose={handleModalClose}
        articleUrl={selectedArticleUrl}
      />
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


