import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title: string;
}

export default function AdminHeader({ setSidebarOpen, title }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <button
        type="button"
        className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 justify-between px-4">
        <div className="flex flex-1 items-center">
           <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
      </div>
    </div>
  );
}
