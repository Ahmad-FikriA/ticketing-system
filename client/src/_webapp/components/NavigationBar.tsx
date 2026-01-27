import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthContext } from "../../context/auth-context";
import { useLogout } from "../../lib/mutations/mutations";
import { toast } from "react-toastify";
import { LayoutDashboard, Ticket, User, LogOut, ChevronDown } from "lucide-react";
import { Badge } from "../../components/ui/badge";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { email, name, role } = useAuthContext();
  const { mutateAsync: logoutUser } = useLogout();

  const [open, setOpen] = useState(false);

  const routeList = [
    { name: "Dashboard", route: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Tickets", route: "/tickets", icon: <Ticket className="h-4 w-4" /> },
  ];

  const initial = name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="flex items-center justify-between w-full">
      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
            {initial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setOpen(false)} 
            />
            
            {/* Dropdown */}
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
                <Badge className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
                  {role}
                </Badge>
              </div>

              <div className="py-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="flex items-center gap-2 p-1.5 bg-white rounded-full shadow-md border border-gray-100">
          {routeList.map(({ name, route, icon }) => (
            <li key={route}>
              <NavLink
                to={route}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-2.5 px-5 rounded-full font-medium text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {icon}
                <span className="hidden sm:inline">{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default NavigationBar;