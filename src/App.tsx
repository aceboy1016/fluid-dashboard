import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Dashboard } from './components/layout/Dashboard'
import { useEffect } from 'react'
import './App.css'

const FluidBackground: React.FC = () => {
  useEffect(() => {
    let script = document.querySelector<HTMLScriptElement>('script[data-fluid-script="true"]')
    if (!script) {
      script = document.createElement('script')
      script.src = `${import.meta.env.BASE_URL}fluid-simulation.js?v=4`
      script.defer = true
      script.dataset.fluidScript = 'true'
      document.body.appendChild(script)
    }

    const existingCanvas = document.getElementById('fluid-canvas')
    if (!existingCanvas) {
      const canvas = document.createElement('canvas')
      canvas.id = 'fluid-canvas'
      canvas.setAttribute('role', 'presentation')
      canvas.style.position = 'fixed'
      canvas.style.inset = '0'
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.zIndex = '-1'
      document.body.appendChild(canvas)
    }

    return () => {
      const inlineCanvas = document.getElementById('fluid-canvas')
      if (inlineCanvas && inlineCanvas.parentElement === document.body) {
        document.body.removeChild(inlineCanvas)
      }
    }
  }, [])

  return null
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FluidBackground />
      <Dashboard />
    </DndProvider>
  )
}

export default App
