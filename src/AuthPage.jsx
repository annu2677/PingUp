import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Heart, Camera, Zap } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { login, signup, isLoading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsAnimating(true)
    console.log('Form submitted:', formData)
    try {
      if (isLogin) {
        console.log('Attempting login...')
        await login(formData.email, formData.password)
        console.log('Login successful')
      } else {
        console.log('Attempting signup...')
        await signup(formData.name, formData.username, formData.email, formData.password)
        console.log('Signup successful')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setIsAnimating(false)
    }
  }

  const toggleMode = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setFormData({ name: '', username: '', email: '', password: '' })
      setIsAnimating(false)
    }, 300)
  }

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, color: 'text-yellow-400' },
    { Icon: Heart, delay: 1, color: 'text-pink-400' },
    { Icon: Camera, delay: 2, color: 'text-blue-400' },
    { Icon: Zap, delay: 3, color: 'text-purple-400' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, delay, color }, index) => (
          <motion.div
            key={index}
            className={`absolute ${color} opacity-20`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${10 + index * 15}%`
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon size={40 + index * 10} />
          </motion.div>
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isAnimating ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAnimating ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl"
          >
            {/* Logo */}
            <motion.div
              className="mb-8 flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white text-3xl font-bold shadow-2xl shadow-purple-500/50">
                  P
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={12} className="text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              className="mb-2 text-center text-4xl font-bold text-slate-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isLogin ? 'Welcome Back' : 'Create your account'}
            </motion.h1>
            <motion.p
              className="mb-8 text-center text-base text-slate-500"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLogin
                ? 'Sign in with your email and password.'
                : 'Register with a display name, username, and email.'}
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your real name"
                            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                          Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a unique handle"
                            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            <motion.div
              className="mt-8 flex items-center gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </motion.div>

            <motion.div
              className="mt-6 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-slate-500">
                {isLogin ? "New to PingUp? " : 'Already have an account? '}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMode}
                  className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                >
                  {isLogin ? 'Create account' : 'Sign in'}
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.p
          className="mt-8 text-center text-sm text-slate-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          By continuing, you agree to our{' '}
          <span className="text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
            Terms & Conditions
          </span>
        </motion.p>
      </motion.div>
    </div>
  )
}
