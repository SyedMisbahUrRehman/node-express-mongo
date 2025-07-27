const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true,
        min: -50,
        max: 100
    },
    humidity: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    sensorId: {
        type: String,
        default: 'default'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SensorData', sensorDataSchema); 