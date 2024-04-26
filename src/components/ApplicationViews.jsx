import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from '../pages/Register.jsx'
import { ArticleList } from '../pages/ArticleList.jsx'



export const ApplicationViews = () => {
    const localNewsUser = localStorage.getItem("news_token")
    const currentUser = JSON.parse(localNewsUser)
    
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<ArticleList currentUser={currentUser} />} />
            </Route>
        </Routes>
    </BrowserRouter>
}