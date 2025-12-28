/**
 * Local development server for API functions
 * This runs on port 3001 and handles /api/* requests
 *
 * Usage: npx tsx scripts/dev-api-server.ts
 */

import * as http from 'http';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Dynamic import of the wellness handler
const loadHandler = async () => {
  const module = await import('../api/wellness');
  return module.default;
};

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // Parse URL
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`);

  // Only handle /api/wellness routes
  if (url.pathname === '/api/wellness') {
    try {
      const handler = await loadHandler();

      // Convert Node IncomingMessage to Request
      const body = await new Promise<string>(resolve => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => resolve(data));
      });

      const request = new Request(`http://localhost:${PORT}${req.url}`, {
        method: req.method,
        headers: Object.fromEntries(
          Object.entries(req.headers)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : (v as string)])
        ),
        body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
      });

      // Call the handler
      const response = await handler(request);

      // Send the response
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      const responseBody = await response.text();
      res.end(responseBody);
    } catch (error) {
      console.error('Handler error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      );
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                  🚀 API Development Server                        ║
╠═══════════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                        ║
║  API endpoint:      http://localhost:${PORT}/api/wellness           ║
║                                                                   ║
║  Environment Check:                                               ║
║    DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '✅ Set (' + process.env.DEEPSEEK_API_KEY.substring(0, 5) + '...)' : '❌ Not set'}              ║
║    GEMINI_API_KEY:   ${process.env.GEMINI_API_KEY ? '✅ Set (' + process.env.GEMINI_API_KEY.substring(0, 5) + '...)' : '❌ Not set'}              ║
║                                                                   ║
║  Press Ctrl+C to stop                                             ║
╚═══════════════════════════════════════════════════════════════════╝
`);
});
