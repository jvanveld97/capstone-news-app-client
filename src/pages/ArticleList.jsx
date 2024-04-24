import { useEffect, useState } from "react";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './ArticleList.css';


export const ArticleList = () => {

    const [articles, setArticles] = useState([])

    const fetchArticlesFromApi = async () => {
        let url = `http://localhost:8000/articles`

        const response = await fetch(url, {
            headers: {
                Authorization: `Token ${JSON.parse(localStorage.getItem("news_token")).token}`
            }
        })
        const articleData = await response.json()
        setArticles(articleData)
    }
    useEffect(() => {
        fetchArticlesFromApi()
    }, [])

    return (
        <div className="article-list-container">
            {articles.map((article, index) => (
                <Card key={index} className="article-card">
                    <CardMedia
                        component="img"
                        alt={article.title}
                        height="140"
                        image={article.url_to_image}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {article.source_name}: <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {article.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" href={article.url} target="_blank" rel="noopener noreferrer">Comment</Button>
                    </CardActions>
                </Card>
            ))}
        </div>
    )
}