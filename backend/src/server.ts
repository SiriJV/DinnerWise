import app from './app.js';

const PORT = 3001;

console.log('[server.ts] ========== NEW BACKEND START (TIMESTAMP: ' + new Date().getTime() + ') ==========');;

app.listen(PORT, () => {
  console.log(`[server.ts] API running on http://localhost:${PORT}`);
});
