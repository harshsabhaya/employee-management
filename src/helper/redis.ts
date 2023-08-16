// * as redis required here
import * as redis from 'redis';
// const redis = require('redis');

const client = redis.createClient({
  socket: {
    port: 6379,
    host: '127.0.0.1',
  },
});

client
  .connect()
  .then(() => {
    console.log('Redis connected');
  })
  .catch((err) => {
    console.log('Redis connection issue ::::::::', err);
  });

client.on('connect', () => {
  console.log('Client connected to redis...');
});

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...');
});

client.on('error', (err) => {
  console.log('Client connection error > ', err);
});

client.on('end', () => {
  console.log('Client disconnection to redis');
});

process.on('SIGINT', () => {
  if (client.isOpen) {
    client.quit();
  }
});

export default client;
