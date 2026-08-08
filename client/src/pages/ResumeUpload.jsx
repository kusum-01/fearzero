import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadDropzone from '../components/resume/UploadDropzone';
import ResumeCard from '../components/resume/ResumeCard';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import Alert from '../components/ui/Alert';

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
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
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
    e.target.value = '';
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
        <h1 className="text-2xl font-semibold text-[#111827]">Resume</h1>
        <p className="text-sm text-[#6B7280] mt-1">Upload your resume in PDF, DOC, or DOCX format.</p>
      </section>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {uploadError && <Alert variant="error">{uploadError}</Alert>}

      {uploadProgress !== null && (
        <div className="mb-4">
          <div className="w-full bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#EC4899] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-[#6B7280] mt-1.5">{uploadProgress}% uploaded</p>
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
