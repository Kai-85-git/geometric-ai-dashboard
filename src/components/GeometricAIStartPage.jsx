import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const GeometricShape = ({ size, color }) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 100 })
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100
      })
    }, Math.random() * 5000 + 3000)

    return () => clearInterval(interval)
  }, [])

  const shapes = [
    <rect width={size} height={size} fill={color} />,
    <circle r={size / 2} fill={color} />,
    <polygon points={`0,${size} ${size / 2},0 ${size},${size}`} fill={color} />,
  ]

  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]

  return (
    <motion.g
      initial={{ x: position.x + '%', y: position.y + '%', opacity: 0 }}
      animate={{ x: position.x + '%', y: position.y + '%', opacity: 0.7 }}
      transition={{ duration: 3, ease: "easeInOut" }}
    >
      {randomShape}
    </motion.g>
  )
}

const GeometricConnection = () => {
  const [start, setStart] = useState({ x: Math.random() * 100, y: Math.random() * 100 })
  const [end, setEnd] = useState({ x: Math.random() * 100, y: Math.random() * 100 })

  useEffect(() => {
    const interval = setInterval(() => {
      setStart({ x: Math.random() * 100, y: Math.random() * 100 })
      setEnd({ x: Math.random() * 100, y: Math.random() * 100 })
    }, Math.random() * 5000 + 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.line
      x1={start.x + '%'}
      y1={start.y + '%'}
      x2={end.x + '%'}
      y2={end.y + '%'}
      stroke="#4FD1C5"
      strokeWidth={1}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  )
}

const GeometricBackground = () => {
  return (
    <svg className="absolute inset-0 w-full h-full">
      {Array.from({ length: 20 }).map((_, i) => (
        <GeometricConnection key={`connection-${i}`} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <GeometricShape key={`shape-${i}`} size={10 + Math.random() * 20} color="#4FD1C5" />
      ))}
    </svg>
  )
}

const GeometricAIStartPage = () => {
  const handleStart = () => {
    // You can add any logic here for what should happen when the Start button is clicked
    console.log("Start button clicked")
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <GeometricBackground />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-8 text-center"
        >
          AI Tool Bookmark Manager
        </motion.h1>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button
            onClick={handleStart}
            className="text-2xl px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Start
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default GeometricAIStartPage