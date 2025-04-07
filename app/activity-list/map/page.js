'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { getDistanceFromLatLonInKm } from '@/utils/distance'
import { COURT_LIST } from '@/config/court-api-path'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function HomePage() {
  const [allCourts, setAllCourts] = useState([])
  const [nearbyMarkers, setNearbyMarkers] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
          setUserLocation(location)
        },
        () => alert('無法取得你的位置')
      )
    }
  }

  useEffect(() => {
    locateUser()
  }, [])

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch(COURT_LIST)
        const data = await res.json()
        if (data.success) {
          setAllCourts(data.rows)
        }
      } catch (err) {
        console.error('無法取得球館資料:', err)
      }
    }
    fetchCourts()
  }, [])

  useEffect(() => {
    if (!userLocation || allCourts.length === 0) return
    updateNearby(userLocation)
  }, [userLocation, allCourts])

  const updateNearby = (center) => {
// 先整理資料：依 court_id groupBy
const grouped = {}

allCourts.forEach((court) => {
  const id = court.court_id
  if (!grouped[id]) {
    const distance = getDistanceFromLatLonInKm(
      center.lat,
      center.lng,
      court.lat,
      court.lng
    )
    grouped[id] = {
      id: court.court_id,
      lat: court.lat,
      lng: court.lng,
      name: court.court_name,
      sportNames: new Set([court.sport_name]),
      distance,
    }
  } else {
    grouped[id].sportNames.add(court.sport_name)
  }
})

// 將 groupBy 結果轉為陣列 + 格式化 label + 篩選距離
const result = Object.values(grouped)
  .map((item) => ({
    lat: item.lat,
    lng: item.lng,
    distance: item.distance,
    label: `${item.name}（${Array.from(item.sportNames).join('、')}）｜${item.distance.toFixed(2)} km`,
  }))
  .filter((item) => item.distance <= 3)

setNearbyMarkers(result)
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">🏀 附近 3 公里內球館</h1>

      <button
        onClick={locateUser}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📍 重新定位
      </button>

      <MapView
        markers={nearbyMarkers}
        userLocation={userLocation}
        mapRef={mapRef}
        onMoveEnd={(center) => updateNearby(center)}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">📋 球館清單：</h2>
        <ul className="space-y-2">
          {nearbyMarkers.map((marker, idx) => (
            <li
              key={idx}
              className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo([marker.lat, marker.lng], 16)
                }
              }}
            >
              {marker.label}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
