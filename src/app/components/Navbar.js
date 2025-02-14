"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsAuthenticated(false);
    window.location.href = "/"; 
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Valor PayTech Blog
        </Typography>
        <Box>
          {!isAuthenticated ? (
            <>
              <Link href="/register" passHref>
                <Button color="inherit">Register</Button>
              </Link>
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/create-post" passHref>
                <Button color="inherit">Create Post</Button>
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
