'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

// 預設 icon 修正
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// 紅色使用者 icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// 初始化地圖 & 綁定移動事件
function SetMapRef({ mapRef, onMoveEnd }) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
    if (onMoveEnd) {
      map.on('moveend', () => {
        const center = map.getCenter()
        onMoveEnd(center)
      })
    }
  }, [map])
  return null
}

export default function MapView({ markers = [], userLocation, mapRef, onMoveEnd }) {
  const defaultCenter = userLocation || { lat: 23.5, lng: 121 }

  return (
    <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} style={{ height: '600px', width: '80%' }}>
      <SetMapRef mapRef={mapRef} onMoveEnd={onMoveEnd} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* 使用者位置 */}
      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} icon={redIcon}>
            <Popup>你在這裡</Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={3000}
            pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
          />
        </>
      )}

      {/* 球館標記 */}
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}