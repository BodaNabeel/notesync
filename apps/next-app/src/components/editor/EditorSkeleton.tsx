export default function EditorSkeleton() {
  return (
    <div className="max-w-5xl mt-12 mx-auto min-h-[calc(100vh-200px)] pb-80">
      <div className="animate-pulse">
        {/* Editor content skeleton */}
        <div className="space-y-4 px-4">
          {/* Title/Header */}
          <div className="w-3/4 h-8 bg-gray-200 rounded-lg"></div>

          {/* Paragraph lines */}
          <div className="space-y-3 mt-6">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
          </div>

          {/* Another paragraph */}
          <div className="space-y-3 mt-6">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
          </div>

          {/* Bullet list simulation */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Final paragraph */}
          <div className="space-y-3 mt-6">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-11/12 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
