import React from 'react'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.tsx'
import './index.css'
import { Canvas } from '@react-three/fiber'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Canvas className='h-full w-full' color='red'>
      <Experience />
    </Canvas>
  </React.StrictMode>,
)
