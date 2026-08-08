import { FileText } from 'lucide-react';
import Button from '../ui/Button';

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ResumeCard = ({ resume, onReplace, onDelete, deleting }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 flex items-center justify-between transition-shadow duration-200 hover:shadow-md">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFF7FA] shrink-0">
        <FileText size={18} className="text-[#EC4899]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#111827] truncate">{resume.originalName}</p>
        <p className="text-xs text-[#6B7280]">
          {formatSize(resume.fileSize)} • Uploaded {new Date(resume.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <Button variant="secondary" onClick={onReplace} className="!px-3 !py-1.5 text-xs">
        Replace
      </Button>
      <Button variant="destructive" onClick={onDelete} disabled={deleting} className="!px-3 !py-1.5 text-xs">
        {deleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  </div>
);

export default ResumeCard;
