import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import "./TopicList.css"
import globeImage from '../assets/globe 2.png';


export const TopicList = () => {
  const [topicsAndArticles, setTopicsAndArticles] = useState([])
  const [newTopicName, setNewTopicName] = useState('')
  const articlesContainerRefs = useRef([])

  useEffect(() => {
    fetchTopicsAndArticles();
    const handleMouseMove = (e, index) => {
        const articlesContainer = articlesContainerRefs.current[index];
        if (articlesContainer && articlesContainer.contains(e.target)) {
            articlesContainer.scrollLeft += e.deltaY;
            e.preventDefault(); // Prevent vertical scrolling when over the articles container
        }
    };
  
      const handleMouseLeave = (index) => {
        const articlesContainer = articlesContainerRefs.current[index];
        if (articlesContainer) {
          articlesContainer.removeEventListener('wheel', (e) => handleMouseMove(e, index));
          articlesContainer.removeEventListener('mouseleave', () => handleMouseLeave(index));
        }
      };
  
      if (articlesContainerRefs.current) {
        articlesContainerRefs.current.forEach((ref, index) => {
          const articlesContainer = ref;
          if (articlesContainer) {
            articlesContainer.addEventListener('wheel', (e) => handleMouseMove(e, index));
            articlesContainer.addEventListener('mouseleave', () => handleMouseLeave(index));
          }
        });
      }
  
      return () => {
        if (articlesContainerRefs.current) {
          articlesContainerRefs.current.forEach((ref, index) => {
            const articlesContainer = ref;
            if (articlesContainer) {
              articlesContainer.removeEventListener('wheel', (e) => handleMouseMove(e, index));
              articlesContainer.removeEventListener('mouseleave', () => handleMouseLeave(index));
            }
          });
        }
      };
    }, []);
  

  const handleCreateTopic = async (topicName) => {
    try {
      const response = await fetch('http://localhost:8000/topics', {
        method: "POST",
          headers: {
            "Authorization": `Token ${JSON.parse(localStorage.getItem("news_token")).token}`,
            "Content-Type": "application/json"
          },
        body: JSON.stringify({ name: topicName })
      });
  
      if (response.ok) {
        // Topic created successfully
        // You can update the state or trigger a re-render here
        fetchTopicsAndArticles();
      } else {
        // Handle error
        console.error('Failed to create topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  }

  const fetchTopicsAndArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/topics/articles', {
        headers: {
            Authorization: `Token ${JSON.parse(localStorage.getItem('news_token')).token}`,
          },
        });
  
      if (response.ok) {
        const topicsWithArticles = await response.json();
        // Update your state with the fetched topics and articles
        setTopicsAndArticles(topicsWithArticles);
      } else {
        // Handle error
        console.error('Failed to fetch topics and articles');
      }
    } catch (error) {
      console.error('Error fetching topics and articles:', error);
    }
  }

  return (
    // <div>
    //   {/* Render topics */}
    //   {topicsAndArticles.map((topicData, index) => (
    //     <div key={topicData.topic}>
    //       <h2>{topicData.topic}</h2>
    //       <Box
    //         sx={{ overflowX: 'auto', whiteSpace: 'nowrap', maxHeight: 325 }}
    //         ref={(el) => (articlesContainerRefs.current[index] = el)}
    //       >
    //         {topicData.articles.map((article, articleIndex) => (
    //           <Card key={articleIndex} sx={{ display: 'inline-block', marginRight: 2, maxWidth: 450, height: 300, }}>
    //             <CardActionArea>
    //                 <Box
    //                     sx={{
    //                         position: 'relative',
    //                         width: '100%',
    //                         paddingBottom: '56.25%', // 16:9 aspect ratio (change as needed)
    //                     }}
    //                 >
    //                     <CardMedia
    //                         component="img"
    //                         image={article.url_to_image || '/static/images/cards/contemplative-reptile.jpg'}
    //                         alt={article.title}
    //                         sx={{
    //                         position: 'absolute',
    //                         top: 0,
    //                         left: 0,
    //                         width: '100%',
    //                         height: '90%',
    //                         objectFit: 'cover',
    //                         }}
    //                     />
    //                 </Box>
    //               <CardContent>
    //                 <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '0.9rem' }}>
    //                   {article.source_name}: {article.title}
    //                 </Typography>
    //                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
    //                   {article.description}
    //                 </Typography>
    //               </CardContent>
    //             </CardActionArea>
    //           </Card>
    //         ))}
    //       </Box>
    //     </div>
    //   ))}
    <div style={{ padding: '80px' }}>
  {/* Render topics */}
  {topicsAndArticles.map((topicData, index) => (
    <div key={topicData.topic}>
      <h2>{topicData.topic}</h2>
      <Box
        sx={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          maxHeight: 325,
        }}
        ref={(el) => (articlesContainerRefs.current[index] = el)}
      >
        {topicData.articles.map((article, articleIndex) => (
          <Card
            key={articleIndex}
            sx={{
              display: 'inline-block',
              marginRight: 2,
              maxWidth: 400,
              height: 300,
            }}
          >
            <CardActionArea>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                }}
              >
                <CardMedia
                  component="img"
                  image={article.url_to_image || globeImage}
                  alt={article.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                //   className="scrolling-text" // Add classes for scrolling animation
                  sx={{
                    fontSize: '0.9rem',
                    whiteSpace: 'normal'
                  }}
                >
                  {`${article.source_name}: ${article.title}`}
                </Typography>
                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                //   className="scrolling-text"
                  sx={{
                    fontSize: '0.8rem',
                  }}
                >
                  {article.description}
                </Typography> */}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </div>
  ))}

      {/* Form or button to create a new topic */}
      <input
        type="text"
        placeholder="Enter new topic name"
        value={newTopicName}
        onChange={(e) => setNewTopicName(e.target.value)}
      />
      <Button onClick={() => handleCreateTopic(newTopicName)}>
        Create Topic
      </Button>
    </div>
  );
};