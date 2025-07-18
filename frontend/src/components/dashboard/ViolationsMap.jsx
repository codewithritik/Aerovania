import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const boundaryGeoJSON = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [85.983, 23.747],
        [85.988, 23.747],
        [85.988, 23.751],
        [85.983, 23.751],
        [85.983, 23.747],
      ],
    ],
  },
};

// Helper component to fit bounds to violations
const MapBounds = ({ violations }) => {
  const map = useMap();

  useEffect(() => {
    const bounds = violations.map((v) => [
      parseFloat(v.latitude),
      parseFloat(v.longitude),
    ]);
    if (bounds.length > 0) {
      map.fitBounds(bounds);
    }
  }, [violations, map]);

  return null;
};

const ViolationsMap = ({ violations }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="font-semibold mb-2">Violation Map</div>
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={[23.749, 85.985]} // Default fallback
          zoom={16}
          style={{ height: "400px", width: "100%" }}
        >
          <MapBounds violations={violations} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON data={boundaryGeoJSON} style={{ color: "blue", weight: 2 }} />

          {violations.map((violation) => (
            <Marker
              key={violation.violation_id}
              position={[
                parseFloat(violation.latitude),
                parseFloat(violation.longitude),
              ]}
            >
              <Popup>
                <div>
                  <strong>Type:</strong> {violation.type}
                  <br />
                  <strong>Time:</strong> {violation.timestamp}
                  <br />
                  <img
                    src={violation.image_url}
                    alt="Violation"
                    width="100%"
                  />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ViolationsMap;
