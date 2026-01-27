import { Outlet } from "react-router";
import NavigationBar from "../components/NavigationBar";

const WebAppLayout = () => {
  return (
    <section className="flex flex-1 flex-col min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <NavigationBar />
        </div>
      </div>
      <main className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </section>
  );
};

export default WebAppLayout;
