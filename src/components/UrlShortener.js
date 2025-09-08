"use client"

import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material"
import { Link as LinkIcon, ContentCopy } from "@mui/icons-material"
import { logInfo, logError, logWarn } from "../middleware/logger"
import {
  generateShortcode,
  isValidUrl,
  isValidShortcode,
  isShortcodeUnique,
  getStoredUrls,
  storeUrls,
} from "../utils/urlUtils"

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("")
  const [customShortcode, setCustomShortcode] = useState("")
  const [validity, setValidity] = useState(30)
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [expiryTime, setExpiryTime] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const validateInputs = () => {
    // Validate URL
    if (!longUrl.trim()) {
      setError("Please enter a URL")
      logWarn("component", "Empty URL submitted")
      return false
    }

    if (!isValidUrl(longUrl)) {
      setError("Please enter a valid URL (include http:// or https://)")
      logError("component", "Invalid URL entered by user")
      return false
    }

    // Validate custom shortcode if provided
    if (customShortcode && !isValidShortcode(customShortcode)) {
      setError("Shortcode must contain only letters and numbers")
      logWarn("component", "Invalid shortcode format entered")
      return false
    }

    // Check shortcode uniqueness
    const existingUrls = getStoredUrls()
    const shortcode = customShortcode || generateShortcode()

    if (!isShortcodeUnique(shortcode, existingUrls)) {
      setError("This shortcode is already taken. Please choose another one.")
      logWarn("component", "Shortcode collision detected")
      return false
    }

    // Validate validity period
    if (validity < 1 || validity > 10080) {
      // Max 1 week
      setError("Validity must be between 1 and 10080 minutes (1 week)")
      logWarn("component", "Invalid validity period entered")
      return false
    }

    return true
  }

  const handleShortenUrl = async () => {
    setError("")
    setSuccess("")

    if (!validateInputs()) {
      return
    }

    setLoading(true)

    try {
      logInfo("component", "Starting URL shortening process")

      const existingUrls = getStoredUrls()
      const shortcode = customShortcode || generateShortcode()
      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + validity * 60 * 1000)

      const newUrl = {
        id: Date.now(),
        longUrl,
        shortcode,
        shortUrl: `http://localhost:3000/${shortcode}`,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        validity,
        clicks: 0,
        clickDetails: [],
      }

      const updatedUrls = [...existingUrls, newUrl]
      storeUrls(updatedUrls)

      setShortenedUrl(newUrl.shortUrl)
      setExpiryTime(expiresAt.toLocaleString())
      setSuccess("URL shortened successfully!")

      logInfo("component", `URL shortened successfully: ${shortcode}`)

      // Reset form
      setLongUrl("")
      setCustomShortcode("")
      setValidity(30)
    } catch (error) {
      setError("Failed to shorten URL. Please try again.")
      logError("component", `URL shortening failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl)
      setSuccess("Copied to clipboard!")
      logInfo("component", "Shortened URL copied to clipboard")
    } catch (error) {
      setError("Failed to copy to clipboard")
      logError("component", "Failed to copy URL to clipboard")
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <LinkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          URL Shortener
        </Typography>

        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Custom Shortcode (Optional)"
            value={customShortcode}
            onChange={(e) => setCustomShortcode(e.target.value)}
            placeholder="mycode123"
            margin="normal"
            helperText="Leave empty for auto-generated shortcode"
          />

          <TextField
            fullWidth
            label="Validity (Minutes)"
            type="number"
            value={validity}
            onChange={(e) => setValidity(Number.parseInt(e.target.value) || 30)}
            margin="normal"
            inputProps={{ min: 1, max: 10080 }}
            helperText="Default: 30 minutes, Max: 1 week (10080 minutes)"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleShortenUrl}
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
        </Box>

        {shortenedUrl && (
          <Paper elevation={1} sx={{ p: 3, mt: 3, bgcolor: "success.light" }}>
            <Typography variant="h6" gutterBottom>
              Shortened URL Created!
            </Typography>

            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Shortened URL</InputLabel>
              <OutlinedInput
                value={shortenedUrl}
                readOnly
                label="Shortened URL"
                endAdornment={
                  <InputAdornment position="end">
                    <Button onClick={copyToClipboard} startIcon={<ContentCopy />} size="small">
                      Copy
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Typography variant="body2" color="text.secondary">
              Expires: {expiryTime}
            </Typography>
          </Paper>
        )}

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}>
          <Alert severity="success" onClose={() => setSuccess("")}>
            {success}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  )
}

export default UrlShortener
