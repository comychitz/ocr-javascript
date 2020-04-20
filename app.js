//
// https://www.youtube.com/watch?v=a2I3tcALTlc
//
// a simple web service that performs OCR on an image of the users choice.
// notes: approach is SSR, using express.js framework
//
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const { createWorker } = Tesseract;

const worker = createWorker({
  logger: m => console.log(m), // logs progress as worker reports updates
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage}).single("comy");

app.set('view engine', 'ejs');

// routes
app.get('/', (req, resp) => {
  resp.render('index');
});

app.post('/upload', (req, resp) => {
  upload(req, resp, err => {
    console.log(req.file);
    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      console.log(`analyzing file "${req.file.originalname}"...`)
      const { data: { text } } = await worker.recognize(`./uploads/${req.file.originalname}`);
      resp.send(text);
      await worker.terminate();
    })();
  })
});

// start server
const port = 4444;
app.listen(port, () => console.log(`Running on port ${port}...`));
