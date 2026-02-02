const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for image uploads

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: "Globetrotter API is running" });
});

// Register User
app.post('/register', (req, res) => {
    const { firstName, lastName, email, password, phone, city, country, additionalInfo, profileImage } = req.body;
    const sql = `INSERT INTO users (firstName, lastName, email, password, phone, city, country, additionalInfo, profileImage) VALUES (?,?,?,?,?,?,?,?,?)`;
    const params = [firstName, lastName, email, password, phone, city, country, additionalInfo, profileImage];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "User registered successfully",
            userId: this.lastID
        });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.get(sql, [email, password], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({
                message: "Login successful",
                user: row
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});

// Update User Profile
app.put('/users/:id', (req, res) => {
    const { firstName, lastName, email, phone, city, country, additionalInfo, profileImage } = req.body;
    const sql = `UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, city = ?, country = ?, additionalInfo = ?, profileImage = ? WHERE id = ?`;
    const params = [firstName, lastName, email, phone, city, country, additionalInfo, profileImage, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "User updated successfully" });
    });
});

// Get Trips for User
app.get('/trips/:userId', (req, res) => {
    const sql = "SELECT * FROM trips WHERE userId = ?";
    const params = [req.params.userId];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ trips: rows });
    });
});

// Create Trip
app.post('/trips', (req, res) => {
    const { userId, destination, startDate, endDate, budget, travelers, description } = req.body;
    const sql = `INSERT INTO trips (userId, destination, startDate, endDate, budget, travelers, description) VALUES (?,?,?,?,?,?,?)`;
    const params = [userId, destination, startDate, endDate, budget, travelers, description];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Trip created successfully",
            tripId: this.lastID
        });
    });
});

// Get Expenses for Trip
app.get('/expenses/:tripId', (req, res) => {
    const sql = "SELECT * FROM expenses WHERE tripId = ?";
    const params = [req.params.tripId];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ expenses: rows });
    });
});

// Add Expense
app.post('/expenses', (req, res) => {
    const { tripId, category, amount, description, date } = req.body;
    const sql = `INSERT INTO expenses (tripId, category, amount, description, date) VALUES (?,?,?,?,?)`;
    const params = [tripId, category, amount, description, date];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Expense added successfully",
            expenseId: this.lastID
        });
    });
});

// Get Community Posts
app.get('/posts', (req, res) => {
    const sql = `
        SELECT posts.*, users.firstName, users.lastName, users.profileImage 
        FROM posts 
        JOIN users ON posts.userId = users.id 
        ORDER BY timestamp DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ posts: rows });
    });
});

// Create Community Post
app.post('/posts', (req, res) => {
    const { userId, content, tags } = req.body;
    const sql = `INSERT INTO posts (userId, content, tags) VALUES (?,?,?)`;
    const params = [userId, content, tags];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Post created successfully",
            postId: this.lastID
        });
    });
});

// AI Chat Endpoint
app.post('/chat', (req, res) => {
    const { message } = req.body;
    let reply = "I'm your AI travel assistant. I can help you plan your trip, find activities, and more. Where are you planning to go?";

    const msg = message.toLowerCase();
    if (msg.includes('paris')) {
        reply = "Paris is wonderful! Don't miss the Eiffel Tower, Louvre Museum, and a cruise on the Seine. I can add these to your itinerary.";
    } else if (msg.includes('tokyo')) {
        reply = "Tokyo is amazing! You should check out Shibuya Crossing, Senso-ji Temple, and Akihabara. Sushi is a must-try!";
    } else if (msg.includes('food') || msg.includes('eat')) {
        reply = "I can recommend some great local dishes. What kind of food are you in the mood for?";
    } else if (msg.includes('budget') || msg.includes('cost')) {
        reply = "I can help you track your expenses. You can set a budget in the Create Trip section.";
    } else if (msg.includes('hello') || msg.includes('hi')) {
        reply = "Hello! Ready to plan your next adventure?";
    }

    // Simulate AI processing delay
    setTimeout(() => {
        res.json({ reply });
    }, 1000);
});

// Get Activities
app.get('/activities', (req, res) => {
    const { search } = req.query;
    let sql = "SELECT * FROM activities";
    let params = [];

    if (search) {
        sql += " WHERE name LIKE ? OR category LIKE ?";
        params = [`%${search}%`, `%${search}%`];
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ activities: rows });
    });
});

// Get Destinations
app.get('/destinations', (req, res) => {
    const { search } = req.query;
    let sql = "SELECT * FROM destinations";
    let params = [];

    if (search) {
        sql += " WHERE name LIKE ? OR country LIKE ? OR category LIKE ?";
        const s = `%${search}%`;
        params = [s, s, s];
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ destinations: rows });
    });
});

// Get Checklist
app.get('/checklist/:userId', (req, res) => {
    const sql = "SELECT * FROM checklist WHERE userId = ?";
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ checklist: rows });
    });
});

// Add Checklist Item
app.post('/checklist', (req, res) => {
    const { userId, text, category } = req.body;
    const sql = "INSERT INTO checklist (userId, text, category) VALUES (?,?,?)";
    db.run(sql, [userId, text, category], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Toggle Checklist Item
app.put('/checklist/:id', (req, res) => {
    const { completed } = req.body;
    const sql = "UPDATE checklist SET completed = ? WHERE id = ?";
    db.run(sql, [completed, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Updated" });
    });
});

// Delete Checklist Item
app.delete('/checklist/:id', (req, res) => {
    const sql = "DELETE FROM checklist WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Deleted" });
    });
});

// Get Itinerary Stops
app.get('/itinerary/:tripId', (req, res) => {
    const sql = "SELECT * FROM itinerary_stops WHERE tripId = ?";
    db.all(sql, [req.params.tripId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ stops: rows });
    });
});

// Add Itinerary Stop
app.post('/itinerary', (req, res) => {
    const { tripId, city, dates, activities } = req.body;
    const sql = "INSERT INTO itinerary_stops (tripId, city, dates, activities) VALUES (?,?,?,?)";
    db.run(sql, [tripId, city, dates, activities], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Update Itinerary Stop
app.put('/itinerary/:id', (req, res) => {
    const { city, dates, activities } = req.body;
    const sql = "UPDATE itinerary_stops SET city = ?, dates = ?, activities = ? WHERE id = ?";
    db.run(sql, [city, dates, activities, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Updated" });
    });
});

// Delete Itinerary Stop
app.delete('/itinerary/:id', (req, res) => {
    const sql = "DELETE FROM itinerary_stops WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Deleted" });
    });
});

// Weather Endpoint (Mock)
app.get('/weather', (req, res) => {
    const { city } = req.query;
    // Simulate weather data
    const conditions = ['Sunny', 'Cloudy', 'Rain', 'Partly Cloudy', 'Clear'];
    const icons = ['☀️', '☁️', '🌧️', '⛅', '☀️'];

    const forecast = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const rand = Math.floor(Math.random() * conditions.length);
        const temp = Math.floor(Math.random() * (30 - 10) + 10);

        return {
            day: dayName,
            temp: `${temp}°C`,
            icon: icons[rand],
            desc: conditions[rand]
        };
    });

    res.json({
        city: city || 'Unknown',
        currentTemp: forecast[0].temp,
        condition: forecast[0].desc,
        icon: forecast[0].icon,
        forecast
    });
});

// Admin Stats Endpoint
app.get('/admin/stats', (req, res) => {
    const stats = {};

    db.serialize(() => {
        db.get("SELECT count(*) as count FROM users", (err, row) => {
            if (err) return;
            stats.users = row.count;

            db.get("SELECT count(*) as count FROM trips", (err, row) => {
                if (err) return;
                stats.trips = row.count;

                db.get("SELECT count(*) as count FROM posts", (err, row) => {
                    if (err) return;
                    stats.posts = row.count;

                    res.json({ stats });
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
