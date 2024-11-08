'use client';
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

function latLongToVector3(lat: number, lon: number, radius: number = 1) {
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    console.error("Invalid lat/lon values:", { lat, lon })
    return new THREE.Vector3(0, 0, 0) // Return a fallback value in case of invalid data
  }

  // Ensure lat and lon are within valid ranges
  lat = Math.max(-90, Math.min(90, lat))
  lon = ((lon + 180) % 360) - 180

  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

const Globe: React.FC = () => {
  const globeRef = useRef<THREE.Mesh>(null)
  const linesRef = useRef<THREE.Group>(null)

  const cities = useMemo(() => [
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
    { name: "Cairo", lat: 30.0444, lon: 31.2357 },
    { name: "Moscow", lat: 55.7558, lon: 37.6173 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Cape Town", lat: -33.9249, lon: 18.4241 },
    { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  ], [])

  const lines = useMemo(() => {
    const lineGeometries = []
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const startPoint = latLongToVector3(cities[i].lat, cities[i].lon)
        const endPoint = latLongToVector3(cities[j].lat, cities[j].lon)

        const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5)
        midPoint.normalize().multiplyScalar(1.2) // Adjust the multiplier to change the curve height

        const curve = new THREE.QuadraticBezierCurve3(
          startPoint,
          midPoint,
          endPoint
        )
        lineGeometries.push(new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)))
      }
    }
    return lineGeometries
  }, [cities])

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#4B0082"
          emissive="#000000"
          specular="#111111"
          shininess={10}
        />
      </Sphere>
      <group ref={linesRef}>
        {lines.map((line, index) => (
          <Line
            key={index}
            points={line.attributes.position.array}
            color="#FF1493"
            lineWidth={1}
          />
        ))}
      </group>
      {cities.map((city, index) => {
        const position = latLongToVector3(city.lat, city.lon, 1.01) // Slightly above the globe surface
        return (
          <mesh key={index} position={position}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshBasicMaterial color="#00FFFF" />
          </mesh>
        )
      })}
    </group>
  )
}

export default Globe