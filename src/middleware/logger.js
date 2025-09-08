import axios from "axios"

/**
 * Logging middleware for the URL Shortener application
 * @param {string} stack - 'frontend' or 'backend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - 'api', 'component', 'handler', etc.
 * @param {string} message - Log message
 */
export const Log = async (stack, level, pkg, message) => {
  try {
    const accessToken = localStorage.getItem("access_token")

    const logData = {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString(),
    }

    // Log to console for development
    console.log(`[${level.toUpperCase()}] ${pkg}: ${message}`)

    // Send to evaluation service if access token is available
    if (accessToken) {
      await axios.post("http://20.244.56.144/evaluation-service/logs", logData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
    } else {
      console.warn("No access token available for logging to evaluation service")
    }
  } catch (error) {
    console.error("Failed to send log:", error)
  }
}

// Convenience methods for different log levels
export const logDebug = (pkg, message) => Log("frontend", "debug", pkg, message)
export const logInfo = (pkg, message) => Log("frontend", "info", pkg, message)
export const logWarn = (pkg, message) => Log("frontend", "warn", pkg, message)
export const logError = (pkg, message) => Log("frontend", "error", pkg, message)
export const logFatal = (pkg, message) => Log("frontend", "fatal", pkg, message)
