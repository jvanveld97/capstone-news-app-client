import { useState, useEffect, useCallback } from 'react';

export const useFetchArticles = (category, searchQuery) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticlesFromApi = async () => {
      let url = `http://localhost:8000/articles`;
      if (category && category !== 'general') {
        url += `?category=${category}`;
      }
      else if (searchQuery) {
        url = `http://localhost:8000/articles/search?q=${searchQuery}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem('news_token')).token}`,
        },
      });
      const articleData = await response.json();
      setArticles(articleData);
    };

    fetchArticlesFromApi();
  }, [category, searchQuery]);

  return articles;
}

// export const FetchSavedArticles = () => {
//     const [articles, setArticles] = useState([]);
  
//     useEffect(() => {
//       const fetchSavedArticlesFromApi = async () => {
//         let url = `http://localhost:8000/saved_articles`
  
//         const response = await fetch(url, {
//           headers: {
//             Authorization: `Token ${JSON.parse(localStorage.getItem('news_token')).token}`,
//           },
//         });
//         const articleData = await response.json();
//         setArticles(articleData);
//       };
  
//       fetchSavedArticlesFromApi();
//     }, []);
  
//     return articles;
//   }

export const useFetchSavedArticles = () => {
    const [articles, setArticles] = useState([]);
  
    const fetchSavedArticles = useCallback(async () => {
      let url = `http://localhost:8000/saved_articles`;
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem('news_token')).token}`,
        },
      });
      const articleData = await response.json();
      setArticles(articleData);
    }, []);
  
    useEffect(() => {
      fetchSavedArticles();
    }, [fetchSavedArticles]);
  
    return { articles, refetchSavedArticles: fetchSavedArticles };
  }

