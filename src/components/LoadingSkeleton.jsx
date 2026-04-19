export const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-300 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
