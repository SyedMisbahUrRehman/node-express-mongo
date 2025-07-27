# Temperature & Humidity Sensor Data API

A Node.js Express application with MongoDB for uploading and retrieving temperature and humidity sensor data.

## Features

- 🌡️ **Temperature & Humidity Data Upload**: Upload sensor readings with validation
- 📊 **Data Retrieval**: Get latest readings or historical data
- 🔍 **Sensor ID Support**: Track multiple sensors
- ✅ **Data Validation**: Ensures temperature (-50°C to 100°C) and humidity (0% to 100%) are within valid ranges
- 🎨 **Web Interface**: Simple HTML form for testing the API

## API Endpoints

### POST /sensor-data
Upload temperature and humidity data from a sensor.

**Request Body:**
```json
{
  "temperature": 25.5,
  "humidity": 60.2,
  "sensorId": "sensor1"  // optional, defaults to "default"
}
```

**Response:**
```json
{
  "message": "Sensor data uploaded successfully",
  "data": {
    "_id": "...",
    "temperature": 25.5,
    "humidity": 60.2,
    "sensorId": "sensor1",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET /sensor-data
Retrieve sensor data with optional filtering.

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100)
- `sensorId` (optional): Filter by specific sensor ID

**Example:**
```
GET /sensor-data?limit=10&sensorId=sensor1
```

### GET /sensor-data/latest
Get the most recent sensor reading.

**Query Parameters:**
- `sensorId` (optional): Get latest reading from specific sensor

**Example:**
```
GET /sensor-data/latest?sensorId=sensor1
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGO_URI=mongodb://localhost:27017/sensor-data
   PORT=3000
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the web interface:**
   Open your browser and go to `http://localhost:3000`

## Database Schema

### SensorData Collection
```javascript
{
  temperature: Number,    // -50 to 100°C
  humidity: Number,       // 0 to 100%
  timestamp: Date,        // Auto-generated
  sensorId: String,       // Default: "default"
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

## Validation Rules

- **Temperature**: Must be between -50°C and 100°C
- **Humidity**: Must be between 0% and 100%
- **Required Fields**: Both temperature and humidity are required

## Example Usage

### Using cURL
```bash
# Upload sensor data
curl -X POST http://localhost:3000/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 23.5, "humidity": 45.2, "sensorId": "living-room"}'

# Get latest reading
curl http://localhost:3000/sensor-data/latest

# Get all data (last 10 readings)
curl http://localhost:3000/sensor-data?limit=10
```

### Using JavaScript
```javascript
// Upload data
const response = await fetch('http://localhost:3000/sensor-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    temperature: 25.5,
    humidity: 60.2,
    sensorId: 'outdoor'
  })
});

// Get latest data
const latestData = await fetch('http://localhost:3000/sensor-data/latest');
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid data or missing required fields
- `404 Not Found`: No sensor data found
- `500 Internal Server Error`: Server-side errors

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **dotenv**: Environment variable management
- **nodemon**: Development server with auto-restart 