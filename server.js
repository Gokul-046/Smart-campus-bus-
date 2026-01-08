const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read data
const readData = (file) => {
    const dataPath = path.join(__dirname, 'data', file);
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (file, data) => {
    const dataPath = path.join(__dirname, 'data', file);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData('users.json');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, role: user.role, name: user.name, id: user.id });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get Buses (Public/Student/Admin)
app.get('/api/buses', (req, res) => {
    const buses = readData('buses.json');
    res.json(buses);
});

// Update Bus Status (Driver/Admin)
app.post('/api/buses/update', (req, res) => {
    const { busId, status, location, lat, lng } = req.body;
    const buses = readData('buses.json');
    const index = buses.findIndex(b => b.id === busId);

    if (index !== -1) {
        if (status) buses[index].status = status;
        if (location) buses[index].location = location;
        if (lat) buses[index].lat = parseFloat(lat);
        if (lng) buses[index].lng = parseFloat(lng);

        writeData('buses.json', buses);
        res.json({ success: true, message: 'Bus updated' });
    } else {
        res.status(404).json({ success: false, message: 'Bus not found' });
    }
});

// Book Seat (Student)
app.post('/api/book', (req, res) => {
    const { listId, studentId } = req.body; // listId could be specific schedule ID, simplified here
    // In a real app we'd have a bookings.json. For simplicity, we just decrement seats in buses.json if available
    // or better, store bookings to show history.

    // Let's implement a simple booking log
    const bookings = readData('bookings.json') || [];
    bookings.push({
        id: Date.now(),
        ...req.body,
        timestamp: new Date().toISOString()
    });
    writeData('bookings.json', bookings);
    res.json({ success: true, message: 'Booking confirmed!' });
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
