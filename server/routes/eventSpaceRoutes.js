const express = require('express');
const router = express.Router();
const eventSpaceController = require('../controllers/eventSpaceController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/event-spaces');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
    }
  }
});

// Error handling middleware for multer
const uploadMiddleware = (req, res, next) => {
  const uploadHandler = upload.array('images', 5); // Allow up to 5 images
  uploadHandler(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// GET /api/event-spaces
router.get('/', eventSpaceController.getAllEventSpaces);

// GET /api/event-spaces/:id
router.get('/:id', eventSpaceController.getEventSpaceById);

// POST /api/event-spaces
router.post('/', uploadMiddleware, eventSpaceController.createEventSpace);

// PUT /api/event-spaces/:id
router.put('/:id', uploadMiddleware, eventSpaceController.updateEventSpace);

router.get('/:id/availability', eventSpaceController.checkAvailability);
router.post('/sync', eventSpaceController.syncEventSpaces);

module.exports = router;