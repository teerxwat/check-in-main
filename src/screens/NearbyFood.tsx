import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import Ripple from '../components/Ripple';

// Fix Leaflet Default Icon Issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [50, 82], // Doubled size
    iconAnchor: [25, 82], // Adjusted anchor
    popupAnchor: [1, -68],
    shadowSize: [82, 82]
});

interface Place {
    id: number;
    name: string;
    description: string;
    rating: number;
    distance: string;
    type: string;
    image: string;
    lat: number;
    lng: number;
    googleMapsUrl: string;
}

const mockPlaces: Place[] = [
    {
        id: 1,
        name: "Jay Fai (Street Food)",
        description: "Michelin-starred crab omelette.",
        rating: 4.8,
        distance: "1.2 km",
        type: "Street Food",
        image: "https://images.unsplash.com/photo-1596627689104-589f81fb80d3?auto=format&fit=crop&q=80&w=300&h=200",
        lat: 13.7525,
        lng: 100.5048,
        googleMapsUrl: "https://goo.gl/maps/example1"
    },
    {
        id: 2,
        name: "The Deck by The River",
        description: "Riverside dining with Wat Arun view.",
        rating: 4.5,
        distance: "800 m",
        type: "Restaurant",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=300&h=200",
        lat: 13.7444,
        lng: 100.4900,
        googleMapsUrl: "https://goo.gl/maps/example2"
    },
    {
        id: 3,
        name: "Thip Samai Pad Thai",
        description: "Legendary Pad Thai wrapped in egg.",
        rating: 4.6,
        distance: "1.5 km",
        type: "Street Food",
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=300&h=200",
        lat: 13.7540,
        lng: 100.5045,
        googleMapsUrl: "https://goo.gl/maps/example3"
    },
    {
        id: 4,
        name: "Blue Whale Cafe",
        description: "Famous blue latte and cozy vibes.",
        rating: 4.4,
        distance: "600 m",
        type: "Cafe",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=200",
        lat: 13.7437,
        lng: 100.4912,
        googleMapsUrl: "https://goo.gl/maps/example4"
    },
    {
        id: 5,
        name: "Krua Apsorn",
        description: "Authentic Thai food, family style.",
        rating: 4.7,
        distance: "2.0 km",
        type: "Restaurant",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=300&h=200",
        lat: 13.7570,
        lng: 100.5020,
        googleMapsUrl: "https://goo.gl/maps/example5"
    }
];

const NearbyFood: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    return (
        <Layout
            showHomeButton={true}
            showGlobalLogo={true}
            showBackButton={true}
            onBack={() => navigate('/check-in-choice')}
        >
            <div className="w-full h-full flex flex-col pt-64 pb-12 px-10 gap-8">

                {/* Header */}
                <h1 className="text-8xl font-bold text-gray-800 ml-4 flex items-center gap-6">
                    {t ? t('nearby_dining') : "Nearby Dining"}
                </h1>

                {/* 60/40 Split Container */}
                <div className="flex-1 flex flex-col rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 bg-white animate-fade-in-up">

                    {/* Top 60%: React Leaflet Map */}
                    <div className="flex-[6] bg-slate-200 relative group overflow-hidden z-0">
                        <MapContainer
                            center={[13.2732, 100.9236]}
                            zoom={17}
                            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                maxNativeZoom={16} // Reduced from 15 to 16 for better clarity (less scaling)
                            />

                            {/* Hotel Marker (Center) */}
                            <Marker position={[13.2732, 100.9236]} icon={RedIcon}>
                                <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent>
                                    <span className="text-lg font-bold">You are here</span>
                                </Tooltip>
                            </Marker>

                            {/* Place Markers */}
                            {mockPlaces.map(place => (
                                <Marker
                                    key={place.id}
                                    position={[place.lat, place.lng]}
                                    eventHandlers={{
                                        click: () => setSelectedPlace(place),
                                    }}
                                >
                                    <Popup>
                                        <b>{place.name}</b><br />{place.type}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Bottom 40%: List */}
                    <div className="flex-[4] bg-white flex flex-col overflow-hidden">

                        {/* Filter Tabs (Mock) */}
                        <div className="flex gap-4 p-6 border-b border-gray-100 overflow-x-auto no-scrollbar">
                            {['All', 'Street Food', 'Restaurant', 'Cafe', 'Bar'].map((type, idx) => (
                                <button
                                    key={type}
                                    className={`relative overflow-hidden px-10 py-4 rounded-full whitespace-nowrap text-3xl font-medium transition-all active:scale-95 ${idx === 0 ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    <Ripple color={idx === 0 ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"} />
                                    <span className="relative z-10">{type}</span>
                                </button>
                            ))}
                        </div>

                        {/* List Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {mockPlaces.map((place) => (
                                <div key={place.id} className="flex gap-6 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                                    {/* Image */}
                                    <div className="w-64 h-64 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-6xl font-bold text-gray-800 leading-tight mb-3">{place.name}</h3>
                                                <p className="text-gray-500 text-4xl font-medium">{place.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-yellow-50 px-5 py-3 rounded-2xl border border-yellow-100">
                                                <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                <span className="text-5xl font-bold text-gray-800">{place.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-4xl line-clamp-2 leading-relaxed">{place.description}</p>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-4 text-gray-500">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                <span className="text-4xl font-medium">{place.distance}</span>
                                            </div>

                                            <button
                                                onClick={() => setSelectedPlace(place)}
                                                className="relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl text-4xl font-bold shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-4"
                                            >
                                                <Ripple color="rgba(255,255,255,0.3)" />
                                                <span className="relative z-10">GO</span>
                                                <svg className="relative z-10 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Modal using Backdrop */}
            {selectedPlace && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md text-center shadow-2xl animate-scale-up relative">
                        <button
                            onClick={() => setSelectedPlace(null)}
                            className="relative overflow-hidden absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <Ripple />
                            <svg className="relative z-10 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" /></svg>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedPlace.name}</h3>
                        <p className="text-gray-500 mb-8 text-lg">Scan to view directions on your phone</p>

                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 inline-block mb-6">
                            {/* Placeholder for real QR Code - In production use 'react-qr-code' */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedPlace.googleMapsUrl)}`}
                                alt="QR Code"
                                className="w-48 h-48"
                            />
                        </div>

                        <p className="text-sm text-gray-400">Google Maps will open on your device.</p>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default NearbyFood;
