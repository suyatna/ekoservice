import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

export const PetaPreviewLokasi = ({ lat, lng, withCard = true }: { lat: number; lng: number; withCard?: boolean }) => {
  const map = (
    <MapContainer center={[lat, lng]} zoom={13} className="h-64 w-full rounded-xl" dragging={false} zoomControl={false} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );

  if (!withCard) return map;
  return <div className="kartu overflow-hidden p-2">{map}</div>;
};
