import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const PetaPreviewLokasi = ({ lat, lng, withCard = true }: { lat: number; lng: number; withCard?: boolean }) => {
  const map = (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="map-preview h-64 w-full rounded-xl md:h-80"
      dragging
      zoomControl
      doubleClickZoom
      touchZoom
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <strong>Eko Service</strong>
          <br />
          Kulkas, Mesin Cuci, dan AC
        </Popup>
      </Marker>
    </MapContainer>
  );

  if (!withCard) return map;
  return <div className="kartu overflow-hidden p-2">{map}</div>;
};
