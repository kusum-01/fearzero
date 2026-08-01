const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ResumeCard = ({ resume, onReplace, onDelete, deleting }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-lg shrink-0">
        📄
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{resume.originalName}</p>
        <p className="text-xs text-gray-500">
          {formatSize(resume.fileSize)} • Uploaded {new Date(resume.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onReplace}
        className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
      >
        Replace
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </div>
);

export default ResumeCard;
