import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

const COORDINATES = {
  lat: 46.00558,
  lng: 8.94965
};

const mapStyles = {
  height: '100%',
  width: '100%',
  borderRadius: '10px'
};

const mapOptions = {
  zoomControl: true,
  mapTypeControl: true,
  mapTypeId: 'satellite',
  streetViewControl: true,
  fullscreenControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
  ]
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAe1QXm-QU1hMjCVEggueQCHGpFwUSNDYY"
  });

  const ErrorComponent = () => (
    <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <svg 
          className="w-12 h-12 text-red-500 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <p className="text-red-500 font-medium mb-2">Map temporarily unavailable</p>
        <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
          <p className="text-gray-300 font-medium">
            3DMAKES
          </p>
          <p className="text-gray-400">
            Via Pietro Peri 9E<br />
            6900 Lugano<br />
            Switzerland
          </p>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${COORDINATES.lat},${COORDINATES.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );

  if (loadError || !isLoaded) {
    return <ErrorComponent />;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={18}
      center={COORDINATES}
      options={mapOptions}
    >
      <MarkerF
        position={COORDINATES}
        title="3DMAKES - Via Pietro Peri 9E, Lugano"
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40)
        }}
      />
    </GoogleMap>
  );
}