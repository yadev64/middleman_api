const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
const app = express()

app.use(cors()) // Allow requests from frontend

// Dynamic proxy middleware based on URL
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url // The original server URL passed as a query param
  if (!targetUrl) {
    return res.status(400).send('URL query parameter is required.')
  }

  // Log the incoming request
  console.log(`Proxying request to: ${targetUrl}`)

  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    logLevel: 'debug', // Logs each request
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Request made to: ${req.url}`)
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err)
    }
  })

  proxyMiddleware(req, res, next) // Forward the request to target
})

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`)
})
