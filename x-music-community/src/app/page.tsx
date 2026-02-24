import Sidebar from '@/components/Sidebar'
import Feed from '@/components/Feed'
import RightPanel from '@/components/RightPanel'
import MobileNav from '@/components/MobileNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-main mx-auto flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-1 lg:flex-none lg:w-[600px]">
          <Feed />
        </div>
        <div className="hidden lg:block">
          <RightPanel />
        </div>
      </div>
      <MobileNav />
    </div>
  )
}