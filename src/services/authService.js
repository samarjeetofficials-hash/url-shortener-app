import axios from "axios"
import { logInfo, logError } from "../middleware/logger"

const BASE_URL = "http://20.244.56.144/evaluation-service"

export const registerUser = async (userData) => {
  try {
    logInfo("api", "Attempting user registration")
    const response = await axios.post(`${BASE_URL}/register`, userData)
    logInfo("api", "User registration successful")
    return response.data
  } catch (error) {
    logError("api", `Registration failed: ${error.message}`)
    throw error
  }
}

export const authenticateUser = async (authData) => {
  try {
    logInfo("api", "Attempting user authentication")
    const response = await axios.post(`${BASE_URL}/auth`, authData)

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token)
      logInfo("api", "Authentication successful, token stored")
    }

    return response.data
  } catch (error) {
    logError("api", `Authentication failed: ${error.message}`)
    throw error
  }
}

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token")
}
