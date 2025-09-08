"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material"
import { ExpandMore, ExpandLess, Analytics, Link as LinkIcon, Mouse } from "@mui/icons-material"
import { logInfo } from "../middleware/logger"
import { getStoredUrls, isUrlExpired } from "../utils/urlUtils"

const UrlStats = () => {
  const [urls, setUrls] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    loadUrls()
  }, [])

  const loadUrls = () => {
    const storedUrls = getStoredUrls()
    setUrls(storedUrls)
    logInfo("component", "URL statistics loaded")
  }

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusChip = (url) => {
    const expired = isUrlExpired(url.expiresAt)
    return <Chip label={expired ? "Expired" : "Active"} color={expired ? "error" : "success"} size="small" />
  }

  if (urls.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Analytics sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No URLs Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start by shortening some URLs to see statistics here.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <Analytics sx={{ mr: 1, verticalAlign: "middle" }} />
          URL Statistics
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Total URLs: {urls.length} | Active: {urls.filter((url) => !isUrlExpired(url.expiresAt)).length} | Expired:{" "}
          {urls.filter((url) => isUrlExpired(url.expiresAt)).length}
        </Alert>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <React.Fragment key={url.id}>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LinkIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          /{url.shortcode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={url.longUrl}
                      >
                        {url.longUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(url)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(url.createdAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(url.expiresAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Mouse sx={{ mr: 1, fontSize: 16 }} />
                        {url.clicks || 0}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(url.id)}
                        disabled={!url.clickDetails || url.clickDetails.length === 0}
                      >
                        {expandedRows.has(url.id) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0 }}>
                      <Collapse in={expandedRows.has(url.id)}>
                        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                          <Typography variant="h6" gutterBottom>
                            Click Details
                          </Typography>

                          {url.clickDetails && url.clickDetails.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Timestamp</TableCell>
                                  <TableCell>Source</TableCell>
                                  <TableCell>User Agent</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {url.clickDetails.map((click, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Typography variant="body2">{formatDate(click.timestamp)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2">{click.source}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          maxWidth: 300,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={click.userAgent}
                                      >
                                        {click.userAgent}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No clicks recorded yet.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default UrlStats
