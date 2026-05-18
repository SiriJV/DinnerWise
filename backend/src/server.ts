import app from './app.js';
import { env, validateEnv, logEnvInfo } from './config/env.js';

// Validate environment configuration at startup
try {
  validateEnv();
} catch (error) {
  console.error('❌ Configuration validation failed:', error);
  process.exit(1);
}

const PORT = env.server.port;
const HOST = env.server.host;

console.log('\n================================================================================');
console.log('[SERVER] Starting DinnerWise Backend');
console.log('================================================================================');

logEnvInfo();

const server = app.listen(PORT, HOST, () => {
  console.log(`[SERVER] ✅ Backend is running at http://${HOST}:${PORT}`);
  console.log(`[SERVER] Frontend can reach this backend at: ${env.api.publicUrl}`);
  console.log(`[SERVER] Ready to accept requests\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n[SERVER] SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] Server closed');
    process.exit(0);
  });
});
