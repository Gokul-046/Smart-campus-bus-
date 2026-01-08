# Smart Campus Bus Management System

A modern, realistic Smart Campus Bus Management System designed for college campus logistics. This project features a glassmorphism UI/UX design and a robust Node.js/Express backend for real-time tracking (prototype), role-based access, and seat booking.

## 🚀 Features

- **Role-Based Dashboards**: Tailored views for Admins, Drivers, and Students.
- **Real-Time Tracking**: Prototype-level bus location and status updates.
- **Seat Booking**: Simple interface for students to book seats on available routes.
- **Glassmorphism UI**: Beautiful, premium interface with modern aesthetics.
- **REST API**: Clean backend communication for CRUD operations.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Data Persistence**: Local JSON storage for easy setup and portable demo.
- **API Communication**: Fetch API.

## 📁 Project Structure

```text
pro/
├── data/               # Local JSON database files
│   ├── buses.json      # Bus fleet and status data
│   ├── users.json      # User credentials and roles
│   └── bookings.json   # Seat booking logs
├── public/             # Static frontend files
│   ├── css/
│   │   └── style.css   # Main CSS with glassmorphism styles
│   ├── js/
│   │   ├── auth.js     # Authentication logic
│   │   └── app.js      # Main dashboard logic
│   ├── index.html      # Login page
│   └── dashboard.html  # Main application view
├── server.js           # Node.js/Express server
└── package.json        # Project dependencies and scripts
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   The app will be running at `http://localhost:3000`.

## 🔑 Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | admin | 123 |
| **Driver** | driver | 123 |
| **Student** | student | 123 |

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
