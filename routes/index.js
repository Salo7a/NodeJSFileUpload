var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const helpers = require('../utils/helpers');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload-profile-pic',(req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form
  let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

  upload(req, res, function(err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were an
      if (req.fileValidationError) {
          return res.send(req.fileValidationError);
      }
      else if (!req.file) {
          return res.send('Please select an image to upload');
      }
      else if (err instanceof multer.MulterError) {
          return res.send(err);
      }
      else if (err) {
          return res.send(err);
      }
      // Display uploaded image for user validation
      res.send(`You have uploaded this image: <hr/><img src="images/${req.file.filename}" width="500"><hr /><a href="./">Upload another image</a>`);
  });
});
module.exports = router;
