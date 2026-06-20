import { motion } from 'framer-motion'

function NavItem({ icon, label, active }) {
  return (
    <motion.div
      whileHover={{ x: 6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all relative ${
        active
          ? 'bg-white shadow-[0_20px_60px_rgba(168,85,247,0.12)]'
          : 'hover:bg-white/80 hover:shadow-sm'
      }`}
    >
      {active && (
        <div className="w-1.5 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 absolute left-0 rounded-r-full"></div>
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm">
        {icon}
      </div>
      <span className="font-medium text-slate-700">{label}</span>
    </motion.div>
  )
}

export default NavItem