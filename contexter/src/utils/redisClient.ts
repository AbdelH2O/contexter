import { createClient } from 'redis';
import { env } from '../env/server.mjs'

const client = createClient({
    url: env.REDIS_FULL_URL,
});
// console.log(import.meta.env.VITE_REDIS_FULL_URL);

// client.connect();
// client.on('error', (err) => console.log('Redis Client Error', err));

export default client;