import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-emerald-500"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M7 10h10" />
              <path d="M7 14h10" />
              <path d="M12 22V2" />
            </svg>
            <span className="ml-2 text-xl font-medium text-emerald-500">JT</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="flex items-center text-gray-600 hover:text-gray-900">
              Resume <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <Link href="#" className="flex items-center text-gray-600 hover:text-gray-900">
              Cover Letter <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <Link href="#" className="flex items-center text-gray-600 hover:text-gray-900">
              Blog <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              For Organizations
            </Link>
          </nav>
        </div>
        <div>
          <Button className="bg-emerald-500 hover:bg-emerald-600">My Documents</Button>
        </div>
      </div>
    </header>
  )
}
