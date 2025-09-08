import { logInfo, logError } from "../middleware/logger"

// Generate random shortcode
export const generateShortcode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validate shortcode (alphanumeric only)
export const isValidShortcode = (shortcode) => {
  const regex = /^[a-zA-Z0-9]+$/
  return regex.test(shortcode)
}

// Check if shortcode is unique
export const isShortcodeUnique = (shortcode, existingUrls) => {
  return !existingUrls.some((url) => url.shortcode === shortcode)
}

// Check if URL is expired
export const isUrlExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime)
}

// Get stored URLs from localStorage
export const getStoredUrls = () => {
  try {
    const urls = localStorage.getItem("shortened_urls")
    return urls ? JSON.parse(urls) : []
  } catch (error) {
    logError("component", "Failed to retrieve stored URLs")
    return []
  }
}

// Store URLs in localStorage
export const storeUrls = (urls) => {
  try {
    localStorage.setItem("shortened_urls", JSON.stringify(urls))
    logInfo("component", "URLs stored successfully")
  } catch (error) {
    logError("component", "Failed to store URLs")
  }
}

// Add click tracking
export const trackClick = (shortcode) => {
  try {
    const urls = getStoredUrls()
    const urlIndex = urls.findIndex((url) => url.shortcode === shortcode)

    if (urlIndex !== -1) {
      urls[urlIndex].clicks = (urls[urlIndex].clicks || 0) + 1
      urls[urlIndex].clickDetails = urls[urlIndex].clickDetails || []
      urls[urlIndex].clickDetails.push({
        timestamp: new Date().toISOString(),
        source: window.location.href,
        userAgent: navigator.userAgent,
      })

      storeUrls(urls)
      logInfo("component", `Click tracked for shortcode: ${shortcode}`)
    }
  } catch (error) {
    logError("component", `Failed to track click for shortcode: ${shortcode}`)
  }
}
