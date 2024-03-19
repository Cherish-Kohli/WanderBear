const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "ap-southeast-2", // Replace with your desired region
});

const s3 = new AWS.S3();
const bucketName = 'cherishkohli-bucket';

const params = {
  Bucket: bucketName,
  Key: 'counter.json',
};

s3.headObject(params, (err, data) => {
  if (err && err.code === 'NotFound') {
    // The counter object does not exist; create it
    createCounterObject();
  } else if (!err) {
    // The object exists; no need to create it again
    console.log('Counter object exists.');
  } else {
    console.error('Error checking for counter object:', err);
  }
});

function createCounterObject() {
  const initialCount = 0;
  const counterObject = { count: initialCount };
  const counterParams = {
    Bucket: bucketName,
    Key: 'counter.json',
    Body: JSON.stringify(counterObject),
    ContentType: 'application/json',
  };

  s3.putObject(counterParams, (err, data) => {
    if (err) {
      console.error('Error creating counter object:', err);
    } else {
      console.log('Counter object created successfully.');
    }
  });
}