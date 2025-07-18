import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import FileUploader from '../components/common/FileUploader';
import Swal from 'sweetalert2';
import { validateDroneViolationJSON } from '../utils/validation';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [jsonPreview, setJsonPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setJsonPreview(null);
    setSelectedFile(null);
    if (!file) return;
    if (file.type !== 'application/json') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a JSON file.',
        confirmButtonText: 'OK',
      });
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validation = validateDroneViolationJSON(data);
        if (!validation.valid) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid JSON Structure',
            text: validation.error,
            confirmButtonText: 'OK',
          });
          setLoading(false);
          return;
        }
        setJsonPreview({
          drone_id: data.drone_id,
          date: data.date,
          location: data.location,
          violationsCount: Array.isArray(data.violations) ? data.violations.length : 0,
        });
        setSelectedFile(file);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Invalid JSON',
          text: 'Could not parse the file as valid JSON.',
          confirmButtonText: 'OK',
        });
      }
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('report', selectedFile);
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      Swal.fire({
        icon: 'success',
        title: 'Upload successful',
        text: data.message || 'Report uploaded successfully',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/dashboard');
      });
      setJsonPreview(null);
      setSelectedFile(null);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: err.message,
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Upload Drone Violation Data (JSON)</h2>
        <FileUploader onFileSelect={handleFileSelect} />
        {loading && <div className="mt-4"><span className="text-blue-600">Validating...</span></div>}
        {jsonPreview && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="font-semibold mb-2">File Preview:</div>
            <div><b>Drone ID:</b> {jsonPreview.drone_id}</div>
            <div><b>Date:</b> {jsonPreview.date}</div>
            <div><b>Location:</b> {jsonPreview.location}</div>
            <div><b>Violations:</b> {jsonPreview.violationsCount}</div>
            <Button className="mt-4 w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Uploading...' : 'Submit'}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadPage; 