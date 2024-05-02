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


    const PlusIcon = createSvgIcon(
        // credit: plus icon from https://heroicons.com/
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>,
        'Plus',
      )
    // Thumbs Up Icon
    const ThumbsUpIcon = createSvgIcon(
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
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
        />
        </svg>,
        'ThumbsUp'
    );
    
    // Thumbs Down Icon
    const ThumbsDownIcon = createSvgIcon(
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
            d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
        />
        </svg>,
        'ThumbsDown'
    )

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
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {article.article.source_name}: <a href={article.article.url} target="_blank" rel="noopener noreferrer">{article.article.title}</a>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {article.article.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" target="_blank" rel="noopener noreferrer" onClick={() => handleModalOpen(article.article.url)}  >Comment</Button>
                        <StyledIconButton onClick={() => console.log('Thumbs up icon clicked')}>
                        <ThumbsUpIcon />
                        </StyledIconButton>
                        <StyledIconButton onClick={() => console.log('Thumbs down icon clicked')}>
                        <ThumbsDownIcon />
                        </StyledIconButton>
                        <StyledIconButton onClick={() => handleDeleteArticle(article.id)}>
                        <DeleteForeverRoundedIcon />
                        </StyledIconButton>
                    </CardActions>
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