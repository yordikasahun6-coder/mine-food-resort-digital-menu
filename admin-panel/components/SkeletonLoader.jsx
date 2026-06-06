export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-24 h-5 bg-[#1A1A1A] rounded animate-pulse"></div>
              <div>
                <div className="w-32 h-7 bg-[#1A1A1A] rounded animate-pulse mb-2"></div>
                <div className="w-48 h-4 bg-[#1A1A1A] rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-24 h-4 bg-[#1A1A1A] rounded animate-pulse hidden sm:block"></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B]/20 rounded-full"></div>
                <div className="w-32 h-4 bg-[#1A1A1A] rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="w-24 h-3 bg-[#1A1A1A] rounded animate-pulse mb-2"></div>
                  <div className="w-full h-12 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
                </div>
                <div className="w-full h-12 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Panel Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#1A1A1A] rounded animate-pulse"></div>
                    <div className="w-32 h-4 bg-[#1A1A1A] rounded animate-pulse"></div>
                  </div>
                  <div className="w-16 h-4 bg-[#1A1A1A] rounded animate-pulse"></div>
                </div>
              </div>
              <div className="divide-y divide-gray-800">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg animate-pulse"></div>
                        <div>
                          <div className="w-32 h-4 bg-[#1A1A1A] rounded animate-pulse mb-2"></div>
                          <div className="w-24 h-3 bg-[#1A1A1A] rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-[#1A1A1A] rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}