import { useEffect, useState } from "react";
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
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import { createSvgIcon } from '@mui/material/utils'
import CommentsModal from "./CommentsModal";
import './ArticleList.css';
import { useFetchSavedArticles, useFetchArticles } from "../components/services/articleFetcher";


// eslint-disable-next-line react/prop-types
export const SavedArticleList = ({currentUser}) => {

    // const [articles, setArticles] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [selectedArticleUrl, setSelectedArticleUrl] = useState(null);
    const { articles, refetchSavedArticles } = useFetchSavedArticles()



    // Styled IconButton component
    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        '&:hover': {
        backgroundColor: theme.palette.action.hover,
        },
    }))

    const handleModalOpen = (articleUrl) => {
        setSelectedArticleUrl(articleUrl)
        setOpenModal(true)
    } 
    const handleModalClose = () => setOpenModal(false)

    // Function to handle removing an article
    const handleDeleteArticle = async (articleId) => {

        await fetch(`http://localhost:8000/saved_articles/${articleId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${JSON.parse(localStorage.getItem("news_token")).token}`,
                "Content-Type": "application/json"
            }
            });
            refetchSavedArticles(); // Call the refetch function after successful deletion
        }

    return (
        <div className="article-list-container">
            {articles && articles.map((article, index) => (
                <Card key={index} className="article-card">
                    <CardMedia
                        component="img"
                        alt={article.article.title}
                        height="140"
                        image={article.article.url_to_image}
                    />
                    <div className="card-content">
                        <div className="article-details" style={{ padding: '16px' }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {/* {article.source_name}:{' '} */}
                            <a href={article.article.url} target="_blank" rel="noopener noreferrer">
                            {article.article.title}
                            </a>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {article.article.description}
                        </Typography>
                        </div>
                        <CardActions className="card-actions">
                        <Button
                            size="small"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleModalOpen(article.article.url)}
                        >
                            Comment
                        </Button>
                        <StyledIconButton onClick={() => handleDeleteArticle(article.id)}>
                        <DeleteForeverRoundedIcon />
                        </StyledIconButton>
                    </CardActions>
                    </div>
                </Card>
            ))}
            <CommentsModal
            open={openModal}
            currentUser={currentUser}
            handleClose={handleModalClose}
            articleUrl={selectedArticleUrl}
            />
        </div>
    )
}