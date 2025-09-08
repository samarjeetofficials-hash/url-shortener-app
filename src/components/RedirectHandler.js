"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, CircularProgress, Button } from "@mui/material"
import { Error, CheckCircle } from "@mui/icons-material"
import { getStoredUrls, isUrlExpired, trackClick } from "../utils/urlUtils"
import { logInfo, logError, logWarn } from "../middleware/logger"

const RedirectHandler = () => {
  const { shortcode } = useParams()
  const [status, setStatus] = useState("loading") // loading, success, error, expired
  const [message, setMessage] = useState("")
  const [originalUrl, setOriginalUrl] = useState("")

  useEffect(() => {
    handleRedirect()
  }, [shortcode])

  const handleRedirect = () => {
    try {
      logInfo("component", `Attempting redirect for shortcode: ${shortcode}`)

      const urls = getStoredUrls()
      const urlData = urls.find((url) => url.shortcode === shortcode)

      if (!urlData) {
        setStatus("error")
        setMessage("Short URL not found")
        logWarn("component", `Shortcode not found: ${shortcode}`)
        return
      }

      if (isUrlExpired(urlData.expiresAt)) {
        setStatus("expired")
        setMessage("This short URL has expired")
        setOriginalUrl(urlData.longUrl)
        logWarn("component", `Expired shortcode accessed: ${shortcode}`)
        return
      }

      // Track the click
      trackClick(shortcode)

      setStatus("success")
      setOriginalUrl(urlData.longUrl)
      logInfo("component", `Successful redirect for shortcode: ${shortcode}`)

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = urlData.longUrl
      }, 2000)
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while processing the redirect")
      logError("component", `Redirect error for shortcode ${shortcode}: ${error.message}`)
    }
  }

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Processing redirect...</Typography>
          </Box>
        )

      case "success":
        return (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Redirecting to destination...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You will be redirected to: {originalUrl}
            </Typography>
            <Button variant="contained" onClick={() => (window.location.href = originalUrl)}>
              Go Now
            </Button>
          </Box>
        )

      case "expired":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Error sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Link Expired
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This short URL has expired. Original URL was: {originalUrl}
            </Typography>
            <Button variant="outlined" onClick={() => (window.location.href = "/")}>
              Create New Short URL
            </Button>
          </Box>
        )

      case "error":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Error sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Error
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {message}
            </Typography>
            <Button variant="outlined" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 400, width: "100%" }}>{renderContent()}</Box>
    </Box>
  )
}

export default RedirectHandler
