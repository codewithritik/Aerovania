const Report = require('../models/Report');
const { reportSchema, filterSchema } = require('../utils/validation');

class ReportController {
  static async uploadReport(req, res) {
    try {
      console.log('Upload request received');
      console.log('Files:', req.file ? 'File present' : 'No file');
      console.log('File details:', req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'N/A');

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({ error: 'File is empty' });
      }

      const fileContent = req.file.buffer.toString();
      console.log('File content preview:', fileContent.substring(0, 100));

      let reportData;
      try {
        reportData = JSON.parse(fileContent);
      } catch (parseError) {
        console.log('JSON parse error:', parseError.message);
        return res.status(400).json({ error: 'Invalid JSON format in uploaded file' });
      }

      const { error, value } = reportSchema.validate(reportData);
      
      if (error) {
        console.log('Validation error:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await Report.create({
        ...value,
        uploadedBy: req.user.id
      });

      res.json({
        message: 'Report uploaded successfully',
        ...result
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      if (error instanceof SyntaxError) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
      
      res.status(500).json({ error: 'Failed to process upload' });
    }
  }

  static async getViolations(req, res) {
    try {
      const { error, value } = filterSchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const violations = await Report.getViolations(value);
      
      res.json({
        violations,
        total: violations.length,
        filters: value
      });

    } catch (error) {
      console.error('Get violations error:', error);
      res.status(500).json({ error: 'Failed to fetch violations' });
    }
  }

  static async getKPIs(req, res) {
    try {
      const { drone_id, date } = req.query;
      
      const kpis = await Report.getKPIs({ drone_id, date });
      
      res.json(kpis);

    } catch (error) {
      console.error('KPI error:', error);
      res.status(500).json({ error: 'Failed to fetch KPIs' });
    }
  }

  static async getFilterOptions(req, res) {
    try {
      const filters = await Report.getFilterOptions();
      res.json(filters);

    } catch (error) {
      console.error('Filters error:', error);
      res.status(500).json({ error: 'Failed to fetch filter options' });
    }
  }

  static async getReportById(req, res) {
    try {
      const { id } = req.params;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid report ID' });
      }

      const report = await Report.getReportById(id);
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json(report);

    } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json({ error: 'Failed to fetch report' });
    }
  }

  static async deleteReport(req, res) {
    try {
      const { id } = req.params;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid report ID' });
      }

      const deleted = await Report.deleteReport(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json({ message: 'Report deleted successfully' });

    } catch (error) {
      console.error('Delete report error:', error);
      res.status(500).json({ error: 'Failed to delete report' });
    }
  }
}

module.exports = ReportController;
