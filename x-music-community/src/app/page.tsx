import Sidebar from '@/components/Sidebar'
import Feed from '@/components/Feed'
import RightPanel from '@/components/RightPanel'
import MobileNav from '@/components/MobileNav'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-main mx-auto flex">
        <ErrorBoundary>
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div className="flex-1 lg:flex-none lg:w-[600px]">
            <Feed />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div className="hidden lg:block">
            <RightPanel />
          </div>
        </ErrorBoundary>
      </div>
      
      <ErrorBoundary>
        <MobileNav />
      </ErrorBoundary>
    </div>
  )
}