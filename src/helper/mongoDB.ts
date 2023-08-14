import mongoose from 'mongoose';

const DB_HOST = process.env.DB_HOST || 'mongodb://127.0.0.1:27017';

export default function initMongo() {
  mongoose
    .connect(DB_HOST, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log('Database Connected');
    })
    .catch((err) => {
      console.log('Database connection issue: ', err);
    });
}

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
