const express = require('express');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-2', // Change this to your desired region
});

app.use(express.static('client'));

// Import your route handlers for different APIs
const ticketmasterRouter = require('./route/ticketmaster');
const youtubeRouter = require('./route/youtube'); 
const hotelsRouter = require('./route/hotels');
const wikimediaRouter = require('./route/wiki'); // Import your maps route handler

// Define route handlers
app.use('/ticketmaster', ticketmasterRouter);
app.use('/youtube', youtubeRouter); 
app.use('/hotels', hotelsRouter);
app.use('/wiki', wikimediaRouter);

// Define a root route handler
app.get('/', (req, res) => {
  res.send('Welcome to your Express application');
});

const s3 = new AWS.S3();

// Specify the S3 bucket and object key for the counter
const bucketName = 'cherishkohli-bucket'; // Replace with your bucket name
const counterKey = 'counter.json'; // Replace with your counter object key

// Function to read the count from S3
function readCountFromS3(callback) {
  const params = { Bucket: bucketName, Key: counterKey };

  s3.getObject(params, (err, data) => {
    if (err) {
      if (err.code === 'NoSuchKey') {
        // The counter object does not exist yet; create it
        return callback(null, 0);
      } else {
        return callback(err);
      }
    }

    // Parse the JSON data and return the count
    const counterData = JSON.parse(data.Body.toString());
    return callback(null, counterData.count);
  });
}

// Function to update the count and write it to S3
function updateCountInS3(count, callback) {
  const counterData = { count: count + 1 };
  const params = {
    Bucket: bucketName,
    Key: counterKey,
    Body: JSON.stringify(counterData),
    ContentType: 'application/json',
  };

  s3.putObject(params, (err, data) => {
    if (err) {
      return callback(err);
    }

    callback(null);
  });
}

// Root route handler
app.get('/visitcount', (req, res) => {
  // Read the current count from S3
  readCountFromS3((err, count) => {
    if (err) {
      console.error('Error reading count from S3:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Update the count and write it back to S3
    updateCountInS3(count, (err) => {
      if (err) {
        console.error('Error updating count in S3:', err);
        return res.status(500).send('Internal Server Error');
      }

      const htmlContent = `Page visits: ${count}`;
      res.send(htmlContent);
    });
  });
});


app.listen(port, function () {
  console.log(`Express app listening at http://${hostname}:${port}/`);
});