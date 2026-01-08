const userStr = localStorage.getItem('user');
if (!userStr) {
    window.location.href = '/index.html';
}

const user = JSON.parse(userStr);
const busGrid = document.getElementById('busGrid');
const welcomeText = document.getElementById('welcomeText');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    welcomeText.textContent = `Welcome, ${user.name} (${user.role.toUpperCase()})`;

    // Populate Profile Section
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileRole').textContent = user.role.toUpperCase();
    document.getElementById('profileId').textContent = `ID: #${user.id}`;

    fetchBuses();
    setInterval(fetchBuses, 3000); // Poll every 3 seconds

    document.getElementById('refreshBtn').addEventListener('click', fetchBuses);

    initMap();
});

let map;
let markers = {};

function initMap() {
    // Center map on a generic location (e.g., around the simulated bus coords)
    // Using coord from first bus or generic center
    map = L.map('map').setView([12.9716, 79.157], 15);

    // Invalidate size to ensure map renders correctly in new layout
    setTimeout(() => map.invalidateSize(), 500);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

async function fetchBuses() {
    try {
        const res = await fetch('/api/buses');
        const buses = await res.json();
        renderBuses(buses);
    } catch (err) {
        console.error('Failed to fetch buses', err);
    }
}

function renderBuses(buses) {
    busGrid.innerHTML = '';

    buses.forEach(bus => {
        const card = document.createElement('div');
        card.className = 'glass-panel card';

        const statusClass = bus.status === 'On Time' ? 'status-ontime' : 'status-delayed';

        const isDriverOrAdmin = user.role === 'admin' || user.role === 'driver';
        const isStudent = user.role === 'student';

        let actionHtml = '';

        if (isDriverOrAdmin) {
            actionHtml = `
                <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <small>Update Status:</small>
                    <div style="display: flex; gap: 5px; margin-top: 5px;">
                        <button onclick="updateStatus('${bus.id}', 'On Time')" style="font-size: 0.8em; padding: 5px;">On Time</button>
                        <button onclick="updateStatus('${bus.id}', 'Delayed')" style="font-size: 0.8em; padding: 5px; background: var(--danger);">Delay</button>
                    </div>
                </div>
            `;
        } else if (isStudent) {
            const isFull = bus.occupied >= bus.capacity;
            actionHtml = `
                <button 
                    onclick="bookSeat('${bus.id}')" 
                    ${isFull ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                    style="margin-top: auto;">
                    ${isFull ? 'Full' : 'Book Seat'}
                </button>
            `;
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3>${bus.name}</h3>
                <span class="status-badge ${statusClass}">${bus.status}</span>
            </div>
            <p style="font-size: 0.9em; opacity: 0.8;">📍 ${bus.location}</p>
            <p style="font-size: 0.9em; opacity: 0.8;">🛣️ ${bus.route}</p>
            
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px; margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.8em;">
                    <span>Occupancy</span>
                    <span>${bus.occupied}/${bus.capacity}</span>
                </div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    <div style="width: ${(bus.occupied / bus.capacity) * 100}%; height: 100%; background: var(--secondary); border-radius: 3px;"></div>
                </div>
            </div>

            ${actionHtml}
        `;
        busGrid.appendChild(card);

        // Update Map Markers
        if (bus.lat && bus.lng) {
            if (markers[bus.id]) {
                markers[bus.id].setLatLng([bus.lat, bus.lng]);
            } else {
                markers[bus.id] = L.marker([bus.lat, bus.lng])
                    .addTo(map)
                    .bindPopup(`<b>${bus.name}</b><br>${bus.status}<br>${bus.location}`);
            }
        }
    });
}

async function updateStatus(busId, status) {
    try {
        const res = await fetch('/api/buses/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ busId, status })
        });
        const data = await res.json();
        if (data.success) fetchBuses();
    } catch (err) {
        alert('Failed to update status');
    }
}

async function bookSeat(busId) {
    if (!confirm('Confirm booking for this bus?')) return;

    try {
        const res = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listId: busId, studentId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            alert('Booking Successful!');
            fetchBuses();
        }
    } catch (err) {
        alert('Booking failed');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}
