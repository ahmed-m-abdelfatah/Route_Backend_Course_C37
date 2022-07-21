const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');

const uploadFilePath = {
  profilePic: 'users/profile',
  coverPic: 'users/cover',
  postPic: 'users/posts',
  general: 'general',
};

const uploadFileValidation = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  pdf: ['application/pdf'],
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
};

const handelMulterError = (err, req, res, next) => {
  console.log('~ handelMulterError', err);

  switch (true) {
    case err.code === 'LIMIT_FILE_SIZE': {
      // multer upload file size limit
      return res.status(400).json({ message: 'File size is too big' }); // 400 Bad Request
    }

    case err.code === 'LIMIT_UNEXPECTED_FILE': {
      // multer upload file size limit
      return res.status(400).json({ message: 'Files exceed the limit' }); // 400 Bad Request
    }

    default:
      return next();
  }
};

function multerUpload(customPath, customValidation, customSize) {
  if (!customPath || customPath == null) {
    customPath = uploadFilePath.general;
  }

  const fullPath = path.join(__dirname, `../uploads/${customPath}`);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      req.filePath = `uploads/${customPath}`;
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const fileName = getKeyByValue(uploadFilePath, customPath) + '__' + nanoid() + '__' + file.originalname;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true); // true = accept file
    } else {
      req.fileValidationError = true;
      cb(null, false); // false = reject file
    }
  };

  const upload = multer({
    dest: fullPath,
    limits: {
      fileSize: customSize,
      // 1024 * 1                 = 1 KIB
      // 1024 * 1024 * 1          = 1 MIB
      // 1024 * 1024 * 1024 * 1   = 1 GIB
    },
    fileFilter, // fileFilter is a function that will accept or reject the file
    storage,
  });

  return upload;
}

module.exports = {
  multerUpload,
  uploadFilePath,
  uploadFileValidation,
  handelMulterError,
};
