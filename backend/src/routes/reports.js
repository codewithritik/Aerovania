const express = require('express');
const multer = require('multer');
const ReportController = require('../controllers/reportController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// Upload report (users and admins can upload)
router.post('/upload', uploadLimiter, authorizeRole(['user', 'admin']), upload.single('report'), ReportController.uploadReport);

// Get violations (all authenticated users can view)
router.get('/violations', ReportController.getViolations);

// Get KPIs (all authenticated users can view)
router.get('/kpis', ReportController.getKPIs);

// Get filter options (all authenticated users can view)
router.get('/filters', ReportController.getFilterOptions);

// Get specific report (all authenticated users can view)
router.get('/:id', ReportController.getReportById);

// Delete report (only admins can delete)
router.delete('/:id', authorizeRole(['admin']), ReportController.deleteReport);

module.exports = router;
