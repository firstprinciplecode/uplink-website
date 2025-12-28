# Uplink Website

Landing page for [uplink.spot](https://uplink.spot) featuring a 3D globe visualization of active tunnels.

## Features

- 🌍 Interactive 3D globe using [globe.gl](https://globe.gl)
- 📍 Real-time tunnel activity display (geolocated)
- 🎨 Dark theme with cyan accents
- 📱 Responsive design

## Development

This is a static website. To run locally:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000

## Deployment

Copy files to server:

```bash
rsync -avz --exclude='.git' ./ root@178.156.149.124:/var/www/uplink-website/
```

## API Dependency

The globe fetches tunnel activity from:
```
GET https://api.uplink.spot/public/tunnel-activity
```

Expected response:
```json
{
  "tunnels": [
    { "lat": 37.77, "lng": -122.42, "city": "San Francisco", "country": "US" }
  ]
}
```

If the API is unavailable, demo data is displayed.

## License

MIT
