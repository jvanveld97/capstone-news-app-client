/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';

export const SearchQueryContext = createContext()

export const SearchQueryProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("")


  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  )
}
