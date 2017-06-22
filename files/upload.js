const fs = require('fs');
const multer = require('multer');
const utils = require('../utils');

var dest =  'uploads/'; // The Uploads Directory

var disk = multer.diskStorage({
  destination: (req, file, done) => {
    if(!fs.existsSync(dest)) fs.mkdirSync(dest);
    done(null, __dirname + '/' + dest);
  },
  filename: (req, file, done) => {
    done(null, 'el_' + utils.auth.getUid(7) + Date.now() + '.' + getExt(file.originalname));
  }
});

var filter = (req, file, done) => {
  if(file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif)$/i)){
    done(null, true);
  } else {
    done(new Error('File type not supported'));
  }
};

var limits = {
  fields: 50,
  files: 10,
  fileSize: 3145728 // 1024 * 1024 * 3 = 3mB
};

// Returns the file extension - Ex. jpg
function getExt(filename) {
  return filename.substring((filename.lastIndexOf('.') + 1), filename.length);
}

module.exports.params = { storage: disk, fileFilter: filter, limits: limits };
module.exports.fileFolder = 'localhost:3000/files/' + dest;
