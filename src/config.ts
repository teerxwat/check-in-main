// URL Configuration for Kiosk-Cloud Hybrid System

// 1. LOCAL HARDWARE API (Running on the Mini PC inside the kiosk)
// Handles: ID Scanner, GSM Module (Calling), Hardware Status
export const LOCAL_HARDWARE_URL = 'http://localhost:8881';

// 2. CLOUD DATABASE API (Running on the central internet server)
// Handles: Room availability, Booking creation, Guest logs, MySQL database
// Note: During local development via Vite proxy, we can use '/api'. 
// For production, this should be the absolute URL of the cloud server.
export const CLOUD_DATABASE_URL = 'http://hotel.donaus-dev.net:8881';
// e.g., export const CLOUD_DATABASE_URL = 'https://api.hotel.donaus-dev.net';
