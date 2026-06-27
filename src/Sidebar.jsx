import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Search, MessageCircle, User, LogOut, Bell } from "lucide-react";
import NavItem from "./NavItem.jsx";

function Sidebar({ user, onLogout, currentPage, unreadCount = 0 }) {
  const navigate = useNavigate();

  const bellIcon = (
    <div className="relative">
      <Bell />
      {unreadCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );

  const navItems = [
    { icon: <Home />, label: "Home", page: "home", path: "/" },
    { icon: <Search />, label: "Explore", page: "explore", path: "/explore" },
    { icon: <MessageCircle />, label: "Messages", page: "messages", path: "/messages" },
    { icon: bellIcon, label: "Notifications", page: "notifications", path: "/notifications" },
    { icon: <User />, label: "Profile", page: "profile", path: "/profile" },
  ];

  return (
    <aside className="hidden h-screen w-72 flex-col gap-6 p-5 md:flex sticky top-0">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass-card rounded-[32px] border border-white/70 p-5"
      >
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl text-white shadow-lg">
            P
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-violet-600/90">Social</p>
            <h1 className="text-2xl font-semibold text-slate-900">PingUp</h1>
          </div>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <div key={item.page} onClick={() => navigate(item.path)}>
              <NavItem icon={item.icon} label={item.label} active={currentPage === item.page} />
            </div>
          ))}
        </div>

        {user && (
          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="mb-4 rounded-2xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Logged in as</p>
              <p className="font-semibold text-slate-900">{user.name || user.username}</p>
            </div>

            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-500/10 px-4 py-3 font-semibold text-red-600"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        )}
      </motion.div>
    </aside>
  );
}

export default Sidebar;