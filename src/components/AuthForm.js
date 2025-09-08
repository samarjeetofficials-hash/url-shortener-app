"use client"

import { useState } from "react"
import { Box, TextField, Button, Paper, Typography, Alert, Tabs, Tab } from "@mui/material"
import { Login, PersonAdd } from "@mui/icons-material"
import { registerUser, authenticateUser } from "../services/authService"
import { logInfo, logError } from "../middleware/logger"

const AuthForm = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Registration form state
  const [regForm, setRegForm] = useState({
    email: "",
    name: "",
    mobileNo: "",
    githubUsername: "",
    rollNo: "",
    accessCode: "",
  })

  // Authentication form state
  const [authForm, setAuthForm] = useState({
    email: "",
    name: "",
    rollNo: "",
    accessCode: "",
    clientID: "",
    clientSecret: "",
  })

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await registerUser(regForm)
      setSuccess(`Registration successful! ClientID: ${response.clientID}`)
      logInfo("component", "User registration completed successfully")

      // Auto-fill auth form with registration data
      setAuthForm((prev) => ({
        ...prev,
        email: regForm.email,
        name: regForm.name,
        rollNo: regForm.rollNo,
        accessCode: regForm.accessCode,
        clientID: response.clientID,
        clientSecret: response.clientSecret,
      }))

      // Switch to auth tab
      setActiveTab(1)
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      logError("component", `Registration failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await authenticateUser(authForm)
      setSuccess("Authentication successful!")
      logInfo("component", "User authentication completed successfully")

      // Notify parent component
      if (onAuthSuccess) {
        onAuthSuccess()
      }
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed")
      logError("component", `Authentication failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Campus Evaluation Setup
        </Typography>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab icon={<PersonAdd />} label="Register" />
          <Tab icon={<Login />} label="Authenticate" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {activeTab === 0 && (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={regForm.email}
              onChange={(e) => setRegForm((prev) => ({ ...prev, email: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Name"
              value={regForm.name}
              onChange={(e) => setRegForm((prev) => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mobile Number"
              value={regForm.mobileNo}
              onChange={(e) => setRegForm((prev) => ({ ...prev, mobileNo: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="GitHub Username"
              value={regForm.githubUsername}
              onChange={(e) => setRegForm((prev) => ({ ...prev, githubUsername: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Roll Number"
              value={regForm.rollNo}
              onChange={(e) => setRegForm((prev) => ({ ...prev, rollNo: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Access Code"
              value={regForm.accessCode}
              onChange={(e) => setRegForm((prev) => ({ ...prev, accessCode: e.target.value }))}
              margin="normal"
              required
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3 }}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box component="form" onSubmit={handleAuth} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Name"
              value={authForm.name}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Roll Number"
              value={authForm.rollNo}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, rollNo: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Access Code"
              value={authForm.accessCode}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, accessCode: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Client ID"
              value={authForm.clientID}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, clientID: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Client Secret"
              value={authForm.clientSecret}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, clientSecret: e.target.value }))}
              margin="normal"
              required
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3 }}>
              {loading ? "Authenticating..." : "Authenticate"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default AuthForm
