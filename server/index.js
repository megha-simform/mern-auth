import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT;
const mongoDbUri = process.env.MONGODB_URI ?? '';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Connects to the MongoDB database and starts the server at the specified port.
try {
  mongoose.connect(mongoDbUri).then((result) => {
    app.listen(port, () => {
      console.log(`Connected db and running app at port ${port}`);
    });
  });
} catch (error) {
  console.log(error);
}
