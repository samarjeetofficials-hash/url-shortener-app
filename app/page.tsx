"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { Link, Analytics } from "@mui/icons-material"

import UrlShortener from "../src/components/UrlShortener"
import UrlStats from "../src/components/UrlStats"
import AuthForm from "../src/components/AuthForm"
import RedirectHandler from "../src/components/RedirectHandler"
import { isAuthenticated } from "../src/services/authService"
import { logInfo } from "../src/middleware/logger"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

const Navigation = ({ authenticated, onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        {authenticated && (
          <>
            <Button color="inherit" href="/">
              Shortener
            </Button>
            <Button color="inherit" href="/stats" startIcon={<Analytics />}>
              Statistics
            </Button>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

const App = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const authStatus = isAuthenticated()
    setAuthenticated(authStatus)
    setLoading(false)

    if (authStatus) {
      logInfo("component", "User authenticated, app initialized")
    }
  }

  const handleAuthSuccess = () => {
    setAuthenticated(true)
    logInfo("component", "Authentication successful, redirecting to app")
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setAuthenticated(false)
    logInfo("component", "User logged out")
  }

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation authenticated={authenticated} onLogout={handleLogout} />

        <Routes>
          {!authenticated ? (
            <>
              <Route path="/" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/stats" element={<UrlStats />} />
              <Route path="/:shortcode" element={<RedirectHandler />} />
            </>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
