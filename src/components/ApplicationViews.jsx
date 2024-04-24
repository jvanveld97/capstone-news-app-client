import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from '../pages/Register.jsx'



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
                <Route path="/" element={<>Articles</>} />
                {/* <Route path='/games' element={<GameList games={gamesState} fetchGames={fetchGamesFromAPI} />} />
                <Route path='/games/:id' element={<GameDetails />} />
                <Route path="/new_game" element={<GameForm fetchGames={fetchGamesFromAPI} />} /> */}
            </Route>
        </Routes>
    </BrowserRouter>
}