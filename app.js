// Uplink Globe Visualization
// Displays active tunnels on a 3D globe

const API_BASE = 'https://api.uplink.spot';
const REFRESH_INTERVAL = 10000; // 10 seconds

let globe;
let tunnelData = [];

// Initialize the globe
function initGlobe() {
  const container = document.getElementById('globe');
  
  globe = Globe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .pointsData([])
    .pointLat('lat')
    .pointLng('lng')
    .pointColor(() => '#00d4ff')
    .pointAltitude(0.01)
    .pointRadius(0.5)
    .pointsMerge(true)
    .atmosphereColor('#00d4ff')
    .atmosphereAltitude(0.15)
    (container);

  // Auto-rotate
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;
  globe.controls().enableZoom = true;

  // Responsive sizing
  handleResize();
  window.addEventListener('resize', handleResize);
}

function handleResize() {
  const container = document.getElementById('globe-container');
  if (globe && container) {
    globe.width(container.clientWidth);
    globe.height(container.clientHeight);
  }
}

// Fetch tunnel activity from API
async function fetchTunnelActivity() {
  try {
    const response = await fetch(`${API_BASE}/public/tunnel-activity`);
    
    if (!response.ok) {
      console.warn('Failed to fetch tunnel activity:', response.status);
      return;
    }

    const data = await response.json();
    tunnelData = data.tunnels || [];
    
    // Update globe
    if (globe) {
      globe.pointsData(tunnelData);
    }

    // Update stats
    updateStats(tunnelData.length);
    
  } catch (error) {
    console.warn('Error fetching tunnel activity:', error);
    // Use demo data if API unavailable
    useDemoData();
  }
}

// Demo data for when API is unavailable
function useDemoData() {
  const demoTunnels = [
    { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'US' },
    { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
    { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'JP' },
    { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'DE' },
    { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'AU' },
    { lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'RU' },
    { lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'MX' },
    { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'SG' },
  ];
  
  tunnelData = demoTunnels;
  
  if (globe) {
    globe.pointsData(tunnelData);
  }
  
  updateStats(tunnelData.length);
}

// Update the stats display
function updateStats(count) {
  const countEl = document.getElementById('tunnel-count');
  if (countEl) {
    countEl.textContent = count;
  }
}

// Copy command to clipboard
function copyCommand() {
  const command = 'npx uplink-cli';
  navigator.clipboard.writeText(command).then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initGlobe();
  fetchTunnelActivity();
  
  // Refresh data periodically
  setInterval(fetchTunnelActivity, REFRESH_INTERVAL);
});

// Make copyCommand available globally
window.copyCommand = copyCommand;
