import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import Button from '../ui/Button';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024;

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
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
      ${isDragging ? 'border-[#EC4899] bg-[#FFF7FA]' : 'border-[#E5E7EB] bg-white'}
      ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#FFF7FA] flex items-center justify-center mx-auto mb-4">
        <UploadCloud size={22} className="text-[#EC4899]" />
      </div>
      <p className="text-sm font-medium text-[#111827] mb-1">Drag & drop your resume here</p>
      <p className="text-xs text-[#6B7280] mb-5">PDF, DOC, or DOCX — max 5MB</p>

      <Button variant="secondary" type="button" onClick={() => inputRef.current?.click()}>
        Browse File
      </Button>

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
