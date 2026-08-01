import { useRef, useState } from 'react';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const UploadDropzone = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndSelect = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onFileSelect(null, 'Only PDF, DOC, or DOCX files are allowed.');
      return;
    }

    if (file.size > MAX_SIZE) {
      onFileSelect(null, 'File size must be under 5MB.');
      return;
    }

    onFileSelect(file, null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndSelect(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors
      ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
      ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <p className="text-gray-600 mb-2">Drag & drop your resume here</p>
      <p className="text-xs text-gray-400 mb-4">PDF, DOC, or DOCX — max 5MB</p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      >
        Browse File
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => validateAndSelect(e.target.files[0])}
      />
    </div>
  );
};

export default UploadDropzone;
