"use client"; 

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("https://blog-ashy-six-25.vercel.app/api/posts/");
        setPosts(res.data);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Blog Posts
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card>
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${post.imageUrl}`}
                  alt="Post Image"
                />
              )}
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2">
                  {post.content.substring(0, 100)}...
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  By {post.author?.username || "Unknown"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
