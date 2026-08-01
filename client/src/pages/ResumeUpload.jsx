import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadDropzone from '../components/resume/UploadDropzone';
import ResumeCard from '../components/resume/ResumeCard';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024;

const ResumeUpload = () => {
  const [status, setStatus] = useState('loading');
  const [resume, setResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const replaceInputRef = useRef(null);

  const fetchResume = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/resume');
      setResume(data.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploadProgress(0);
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      setResume(data.data);
      setSuccessMsg('Resume uploaded successfully.');
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleFileSelect = (file, validationError) => {
    setSuccessMsg(null);
    setUploadError(null);
    if (validationError) {
      setUploadError(validationError);
      return;
    }
    uploadFile(file);
  };

  const handleReplaceFile = (e) => {
    setSuccessMsg(null);
    setUploadError(null);
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError('File size must be under 5MB.');
      return;
    }
    uploadFile(file);
    e.target.value = ''; // reset so selecting the same file again still fires onChange
  };

  const handleDelete = async () => {
    setDeleting(true);
    setSuccessMsg(null);
    setUploadError(null);
    try {
      await api.delete('/resume');
      setResume(null);
      setSuccessMsg('Resume deleted.');
    } catch (err) {
      setUploadError('Could not delete resume. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <Loader label="Loading resume info..." />
      </DashboardLayout>
    );
  }

  if (status === 'error') {
    return (
      <DashboardLayout>
        <ErrorMessage message="Couldn't load resume data." onRetry={fetchResume} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Resume</h1>
        <p className="text-sm text-gray-500 mt-1">Upload your resume in PDF, DOC, or DOCX format.</p>
      </section>

      {successMsg && (
        <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {successMsg}
        </div>
      )}

      {uploadError && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {uploadError}
        </div>
      )}

      {uploadProgress !== null && (
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
        </div>
      )}

      {resume ? (
        <>
          <ResumeCard
            resume={resume}
            onReplace={() => replaceInputRef.current?.click()}
            onDelete={handleDelete}
            deleting={deleting}
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleReplaceFile}
          />
        </>
      ) : (
        <UploadDropzone onFileSelect={handleFileSelect} disabled={uploadProgress !== null} />
      )}
    </DashboardLayout>
  );
};

export default ResumeUpload;
