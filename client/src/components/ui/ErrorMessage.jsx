const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <p className="text-red-500 font-medium mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
