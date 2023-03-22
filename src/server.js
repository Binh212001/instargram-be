const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const route = require('./routes');
const multer = require('multer');

const app = express();
app.use(express.json({ urlencoded: true }));
app.use(morgan('common'));
app.use(cors());

app.use(
  '/public/images',
  express.static(path.join(__dirname, './public/images')),
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/images');
  },
  filename: function (req, file, cb) {
    const { fileName } = req.body;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
route(app);
app.post(
  '/api/v1/upload/image',
  upload.single('picture'),
  (req, res, next) => {},
);
mongoose.set('strictQuery', true);
mongoose

  .connect('mongodb://127.0.0.1:27017/social-media', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected');
  });

app.listen(4040, () => {
  console.log('My server is running');
});
