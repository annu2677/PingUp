import { useEffect, useState } from 'react'
import { useSocial } from './SocialContext'

export default function DebugPosts() {
  const { posts } = useSocial()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`') setVisible((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!visible) return null

  return (
    <div style={{position:'fixed',right:12,top:12,zIndex:9999,maxHeight:'80vh',overflow:'auto',background:'rgba(0,0,0,0.8)',color:'#fff',padding:12,borderRadius:8,width:420}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <strong>Posts Debug</strong>
        <button onClick={() => setVisible(false)} style={{background:'transparent',color:'#fff',border:'none',cursor:'pointer'}}>✕</button>
      </div>
      <pre style={{whiteSpace:'pre-wrap',fontSize:11}}>{JSON.stringify(posts, null, 2)}</pre>
      <div style={{marginTop:8,fontSize:12,opacity:0.8}}>Toggle with ` (backtick)</div>
    </div>
  )
}
