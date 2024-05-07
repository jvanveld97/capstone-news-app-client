import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from '../pages/Register.jsx'
import { ArticleList } from '../pages/ArticleList.jsx'
import { SavedArticleList } from "../pages/SavedArticleList.jsx"
import { TopicList } from "../pages/TopicList.jsx"



export const ApplicationViews = () => {
  const localNewsUser = localStorage.getItem("news_token")
  const currentUser = JSON.parse(localNewsUser)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route
            path="/"
            element={
              <ArticleList
                key="general"
                category="general"
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/entertainment"
            element={
              <ArticleList
                key="entertainment"
                category="entertainment"
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/technology"
            element={
              <ArticleList
                key="technology"
                category="technology"
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/sports"
            element={
              <ArticleList
                key="sports"
                category="sports"
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/science"
            element={
              <ArticleList
                key="science"
                category="science"
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/saved_articles"
            element={
              <SavedArticleList
                key="saved"
                category="saved"
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/topics/articles"
            element={
              <TopicList
                key="topics"
                category="topics"
                currentUser={currentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}