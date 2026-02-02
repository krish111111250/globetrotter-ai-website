const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'globetrotter.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            // Create Users Table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT,
                lastName TEXT,
                email TEXT UNIQUE,
                password TEXT,
                phone TEXT,
                city TEXT,
                country TEXT,
                additionalInfo TEXT,
                profileImage TEXT
            )`);

            // Create Trips Table
            db.run(`CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                destination TEXT,
                startDate TEXT,
                endDate TEXT,
                budget REAL,
                travelers INTEGER,
                description TEXT,
                FOREIGN KEY(userId) REFERENCES users(id)
            )`);

            // Create Expenses Table
            db.run(`CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tripId INTEGER,
                category TEXT,
                amount REAL,
                description TEXT,
                date TEXT,
                FOREIGN KEY(tripId) REFERENCES trips(id)
            )`);

            // Create Community Posts Table
            db.run(`CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                content TEXT,
                tags TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES users(id)
            )`);

            // Create Activities Table
            db.run(`CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                category TEXT,
                price TEXT,
                rating TEXT,
                img TEXT
            )`);

            // Create Destinations Table
            db.run(`CREATE TABLE IF NOT EXISTS destinations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                country TEXT,
                costIndex TEXT,
                popularity TEXT,
                description TEXT,
                image TEXT,
                category TEXT
            )`);

            // Ensure 'category' column exists for older databases
            db.run(`ALTER TABLE destinations ADD COLUMN category TEXT`, (err) => {
                // ignore error if column already exists
            });

            // Create Checklist Table
            db.run(`CREATE TABLE IF NOT EXISTS checklist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                text TEXT,
                category TEXT,
                completed BOOLEAN DEFAULT 0,
                FOREIGN KEY(userId) REFERENCES users(id)
            )`);

            // Create Itinerary Stops Table
            db.run(`CREATE TABLE IF NOT EXISTS itinerary_stops (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tripId INTEGER,
                city TEXT,
                dates TEXT,
                activities TEXT,
                FOREIGN KEY(tripId) REFERENCES trips(id)
            )`);

            // Seed Activities if empty
            db.get("SELECT count(*) as count FROM activities", (err, row) => {
                if (row && row.count === 0) {
                    const activities = [
                        { name: "Louvre Museum Tour", category: "Culture", price: "$25", rating: "4.8", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
                        { name: "Seine River Cruise", category: "Romantic", price: "$40", rating: "4.9", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
                        { name: "Eiffel Tower Climb", category: "Adventure", price: "$30", rating: "4.7", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80" },
                        { name: "Montmartre Food Tour", category: "Food", price: "$65", rating: "5.0", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80" }
                    ];
                    const stmt = db.prepare("INSERT INTO activities (name, category, price, rating, img) VALUES (?,?,?,?,?)");
                    activities.forEach(a => stmt.run(a.name, a.category, a.price, a.rating, a.img));
                    stmt.finalize();
                    console.log("Seeded activities");
                }
            });

            // Seed Destinations (add more real places with category)
            db.get("SELECT count(*) as count FROM destinations", (err, row) => {
                const currentCount = row?.count || 0;
                if (currentCount < 12) {
                    const destinations = [
                        // Urban
                        { name: 'Paris', country: 'France', costIndex: '$$$', popularity: '98%', desc: 'Experience the city of lights, world-class museums, and iconic cafes.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', category: 'Urban' },
                        { name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularity: '95%', desc: 'A neon-lit metropolis blending ancient traditions with futuristic tech.', image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80', category: 'Urban' },
                        { name: 'New York', country: 'USA', costIndex: '$$$', popularity: '97%', desc: 'Skyscrapers, Broadway, and diverse neighborhoods with iconic city energy.', image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80', category: 'Urban' },
                        // Beach
                        { name: 'Bali', country: 'Indonesia', costIndex: '$', popularity: '92%', desc: 'Tropical paradise known for volcanic mountains and iconic rice paddies.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', category: 'Beach' },
                        { name: 'Santorini', country: 'Greece', costIndex: '$$', popularity: '93%', desc: 'Whitewashed cliffside villages overlooking turquoise Aegean waters.', image: 'https://images.unsplash.com/photo-1508599589929-9ef16e8b6d01?auto=format&fit=crop&w=1200&q=80', category: 'Beach' },
                        { name: 'Maldives', country: 'Maldives', costIndex: '$$$', popularity: '90%', desc: 'Crystal-clear lagoons and overwater bungalows perfect for relaxation.', image: 'https://images.unsplash.com/photo-1500375592092-40eb6f1a4f3f?auto=format&fit=crop&w=1200&q=80', category: 'Beach' },
                        // Mountain
                        { name: 'Swiss Alps', country: 'Switzerland', costIndex: '$$$', popularity: '94%', desc: 'Snow-capped peaks, alpine villages, and world-class skiing.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', category: 'Mountain' },
                        { name: 'Banff', country: 'Canada', costIndex: '$$', popularity: '91%', desc: 'Emerald lakes and rugged Rocky Mountain scenery.', image: 'https://images.unsplash.com/photo-1470770903676-69f16f0ad8ba?auto=format&fit=crop&w=1200&q=80', category: 'Mountain' },
                        { name: 'Patagonia', country: 'Argentina', costIndex: '$$', popularity: '89%', desc: 'Dramatic peaks, glaciers, and windswept landscapes.', image: 'https://images.unsplash.com/photo-1500048993953-d23a4365e0df?auto=format&fit=crop&w=1200&q=80', category: 'Mountain' },
                        // Historical
                        { name: 'Rome', country: 'Italy', costIndex: '$$', popularity: '96%', desc: 'Walk among ancient ruins and savor timeless Italian cuisine.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', category: 'Historical' },
                        { name: 'Athens', country: 'Greece', costIndex: '$$', popularity: '88%', desc: 'Birthplace of democracy with iconic temples and archaeology.', image: 'https://images.unsplash.com/photo-1501696461410-4583b0d87a3d?auto=format&fit=crop&w=1200&q=80', category: 'Historical' },
                        { name: 'Cairo', country: 'Egypt', costIndex: '$', popularity: '87%', desc: 'Home of the pyramids and ancient treasures along the Nile.', image: 'https://images.unsplash.com/photo-1518593925933-0fe325e0b8ba?auto=format&fit=crop&w=1200&q=80', category: 'Historical' },
                        // Culinary
                        { name: 'Osaka', country: 'Japan', costIndex: '$$', popularity: '90%', desc: 'Street-food paradise famed for takoyaki and okonomiyaki.', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80', category: 'Culinary' },
                        { name: 'Naples', country: 'Italy', costIndex: '$', popularity: '85%', desc: 'Birthplace of pizza with vibrant markets and local flavor.', image: 'https://images.unsplash.com/photo-1520962919193-2cce94f7bb3b?auto=format&fit=crop&w=1200&q=80', category: 'Culinary' },
                        { name: 'Bangkok', country: 'Thailand', costIndex: '$', popularity: '93%', desc: 'Night markets, street food, and dynamic culinary scene.', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad89?auto=format&fit=crop&w=1200&q=80', category: 'Culinary' },
                    ];
                    const stmt = db.prepare("INSERT INTO destinations (name, country, costIndex, popularity, description, image, category) VALUES (?,?,?,?,?,?,?)");
                    destinations.forEach(d => stmt.run(d.name, d.country, d.costIndex, d.popularity, d.desc, d.image, d.category));
                    stmt.finalize();
                    console.log("Seeded destinations (extended)");
                }
            });
        });
    }
});

module.exports = db;
