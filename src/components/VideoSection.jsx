import { useRef, useState } from 'react'

export default function VideoSection({ poster, onStateChange }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [failed, setFailed] = useState(false)
  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().then(() => { setPlaying(true); onStateChange?.(true) }).catch(() => { setPlaying(false); onStateChange?.(false) })
    else { video.pause(); setPlaying(false); onStateChange?.(false) }
  }
  return <><video ref={videoRef} className="hero-video" autoPlay muted loop playsInline poster={poster} onError={() => { setFailed(true); setPlaying(false); onStateChange?.(false) }} onPlay={() => { setFailed(false); setPlaying(true); onStateChange?.(true) }} onPause={() => { setPlaying(false); onStateChange?.(false) }}><source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-the-coast-1577/1080p.mp4" type="video/mp4" /></video>{failed && <div className="video-fallback" role="status">Travel film unavailable · viewing the still image</div>}<button className="round-play hero-video-control" onClick={toggle} aria-label={failed ? 'Retry travel film' : playing ? 'Pause travel film' : 'Play travel film'}>{failed || !playing ? '▶' : 'Ⅱ'}</button></>
}
