import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from '../pages/Register.jsx'
import { ArticleList } from '../pages/ArticleList.jsx'



export const ApplicationViews = () => {
    const [newsState, setNewsState] = useState([])

    const fetchNewsFromAPI = async () => {
        let url = "http://localhost:8000/articles"

        const response = await fetch(url,
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("news_token")).token}`
                }
            })
        const articles = await response.json()
        setNewsState(articles)
    }


    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<ArticleList />} />
            </Route>
        </Routes>
    </BrowserRouter>
}