import { Navigate, Outlet } from "react-router-dom"
import { NavBar } from "./NavBar.jsx"
import { SearchQueryProvider } from '../pages/SearchQueryContext'


export const Authorized = () => {
  if (localStorage.getItem("news_token")) {
    return (
      <SearchQueryProvider>
        <NavBar />
        <main className="p-4">
          <Outlet />
        </main>
      </SearchQueryProvider>
    )
  }
  return <Navigate to="/login" replace />
}