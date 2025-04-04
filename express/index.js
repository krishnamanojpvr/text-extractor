const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Set up storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to handle image upload and OCR
app.post('/upload', upload.single('imgUpload'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const image = req.file.buffer;

  Tesseract.recognize(image, 'eng', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      res.send(text);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
