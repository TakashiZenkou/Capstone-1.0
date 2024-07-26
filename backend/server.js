const express = require('express');
const http = require('http');
const { Pool } = require('pg');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const rooms = new Map();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // Your frontend URL
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Allow credentials (cookies, headers, etc.)
}));

app.use(express.json());

app.use(session({
    secret: 'your_secure_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` for HTTPS
    maxAge: 1000 * 60 * 60 * 24 // One day in milliseconds
}));

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "Supershadow123",
    database: "Users",
    port: 5432 // Default PostgreSQL port
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', () => {
        const roomId = uuidv4(); // Generate a unique room ID
        rooms.set(roomId, new Set()); // Initialize an empty set of users for the room
        rooms.get(roomId).add(socket.id);
        socket.join(roomId);
        console.log(roomId);
        console.log('Rooms:', rooms);
        socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId) => {
        console.log(roomId);
        console.log(rooms);
        if (rooms.has(roomId)) {
            socket.join(roomId);
            rooms.get(roomId).add(socket.id);
            io.to(roomId).emit('roomJoined', roomId);// Notify other users in the room
            console.log(rooms);
        } else {
            console.log("I got here")
            socket.emit('error', 'Room does not exist');
        }
    });

    socket.on('sendMessage', (data) => {
        console.log(data);
        const { roomId, message, username } = data;
        console.log(roomId);
        io.to(roomId).emit('chatMessage', { username, text: message });
    });

    socket.on('backgroundUpdate', (data) => {
        const { roomId, background } = data;
        io.to(roomId).emit('backgroundUpdate', { background });
        console.log(data);
    });

    socket.on('updateTasks', ({ roomId, tasks }) => {
        console.log(tasks);
        console.log(roomId);
        rooms[roomId] = tasks;
        socket.to(roomId).emit('updateTasks', tasks);
    });

    // Handle widget updates
    socket.on('widgetUpdate', (data) => {
        const { roomId, widget, position } = data;
        io.to(roomId).emit('widgetUpdate', { widget, position });
    });

    socket.on('drawing', (data) => {
        const { roomId, type, x, y, color, brushSize } = data;
        socket.to(roomId).emit('drawing', { type, x, y, color, brushSize });
    });

    socket.on('clearCanvas', (roomId) => {
        socket.to(roomId).emit('clearCanvas');
    });

    socket.on('undo', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('undo');
    });

    // Handle redo event
    socket.on('redo', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('redo');
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove the socket from all rooms
        rooms.forEach((users, roomId) => {
            if (users.has(socket.id)) {
                users.delete(socket.id);
                if (users.size === 0) {
                    rooms.delete(roomId); // Optionally remove empty rooms
                }
            }
        });
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('You are not authenticated.');
    }
}



app.post('/signup', async (req, res) => {
    const sql = "INSERT INTO users (username, password, lastname, firstname, gender, education, academic) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const { username, password, lastname, firstname, gender, education, academic } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = [username, hashedPassword, lastname, firstname, gender, education, academic];
        const result = await pool.query(sql, values);

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error while registering user" });
    }
});

app.get('/user-details', isAuthenticated, async (req, res) => {
    const userId = req.session.user;
    try {
        const result = await pool.query('SELECT firstname, lastname, username, education, academic, gender FROM Users WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/update-user', async (req, res) => {
    const userId = req.user.id; // Adjust this according to your authentication setup
    const { firstname, lastname, username, password, education, academic, gender } = req.body;
    
    // Input validation
    if (!firstname || !lastname || !username || !password || !education || !academic || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user details
        await pool.query(
            `UPDATE Users
             SET firstname = $1, lastname = $2, username = $3, password = $4, education = $5, academic = $6, gender = $7
             WHERE id = $8`,
            [firstname, lastname, username, hashedPassword, education, academic, gender, userId]
        );
        res.json({ message: 'User details updated successfully' });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const sql = "SELECT * FROM Users WHERE Username = $1";
    const values = [req.body.username];

    try {
        const result = await pool.query(sql, values);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                req.session.user = user.id;
                req.session.authorized = true;
                req.session.save(() => {
                    console.log("Success");
                    res.json("Success");
                });
            } else {
                res.status(401).json("Failed");
            }
        } else {
            res.status(401).json("Failed");
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json("Error");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('connect.sid'); // Clear the cookie associated with the session
        res.status(200).send('Logout successful');
    });
});

server.listen(8081, () => {
    console.log('Server is listening on port 8081');
});