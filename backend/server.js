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
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Setup CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());


// Setup session
app.use(session({
    secret: 'your_secure_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
}));

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "Supershadow123",
    database: "Users",
    port: 5432 
});

// Socket.IO handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', () => {
        const roomId = uuidv4();
        socket.join(roomId); 
        rooms.set(roomId, new Map()); 
        socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', ({ roomId, username }) => {
        if (rooms.has(roomId)) {
            socket.join(roomId);
            rooms.get(roomId).set(socket.id, username);
            console.log(Array.from(rooms.get(roomId).values()));
            io.to(roomId).emit('updateUsernames', Array.from(rooms.get(roomId).values()));
            socket.emit('roomJoined', roomId);
        } else {
            socket.emit('error', `Room does not exist: ${roomId}`);
        }
    });


    socket.on('sendMessage', (data) => {
        const { roomId, message, username } = data;
        io.to(roomId).emit('chatMessage', { username, text: message });
    });

    socket.on('backgroundUpdate', (data) => {
        const { roomId, background } = data;
        io.to(roomId).emit('backgroundUpdate', { background });
    });

    socket.on('updateTasks', ({ roomId, tasks }) => {
        rooms.get(roomId).tasks = tasks;
        socket.to(roomId).emit('updateTasks', tasks);
    });

    socket.on('widgetUpdate', (data) => {
        const { roomId, widget, position } = data;
        io.to(roomId).emit('widgetUpdate', { widget, position });
    });

    socket.on('drawing', (data) => {
        const { roomId, type, x, y, color, brushSize, isEraser } = data;
        socket.to(roomId).emit('drawing', { type, x, y, color, brushSize, isEraser });
    });

    socket.on('clearCanvas', (roomId) => {
        socket.to(roomId).emit('clearCanvas');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        rooms.forEach((users, roomId) => {
            if (users.has(socket.id)) {
                users.delete(socket.id);
                io.to(roomId).emit('updateUsernames', Array.from(users.values()));
                if (users.size === 0) {
                    rooms.delete(roomId); 
                }
            }
        });
    });
});

;

// Routes

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const values = [username, hashedPassword, lastname, firstname, gender, education, academic];
        const result = await pool.query(sql, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error while registering user" });
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/update-user', isAuthenticated, async (req, res) => {
    const userId = req.session.user;
    const { firstname, lastname, username, password, education, academic, gender } = req.body;

    try {
        const result = await pool.query('SELECT * FROM Users WHERE id = $1', [userId]);
        const currentUser = result.rows[0];

        let hashedPassword = currentUser.password;
        if (password && password !== currentUser.password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updates = [];
        const values = [];
        let index = 1;

        if (firstname && firstname !== currentUser.firstname) {
            updates.push(`firstname = $${index++}`);
            values.push(firstname);
        }
        if (lastname && lastname !== currentUser.lastname) {
            updates.push(`lastname = $${index++}`);
            values.push(lastname);
        }
        if (username && username !== currentUser.username) {
            updates.push(`username = $${index++}`);
            values.push(username);
        }
        if (hashedPassword !== currentUser.password) {
            updates.push(`password = $${index++}`);
            values.push(hashedPassword);
        }
        if (education && education !== currentUser.education) {
            updates.push(`education = $${index++}`);
            values.push(education);
        }
        if (academic && academic !== currentUser.academic) {
            updates.push(`academic = $${index++}`);
            values.push(academic);
        }
        if (gender && gender !== currentUser.gender) {
            updates.push(`gender = $${index++}`);
            values.push(gender);
        }

        if (updates.length === 0) {
            return res.json({ message: 'No fields to update' });
        }

        values.push(userId);
        const query = `UPDATE Users SET ${updates.join(', ')} WHERE id = $${index}`;
        await pool.query(query, values);

        res.json({ message: 'User details updated successfully' });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/check-room/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (rooms.has(roomId)) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('connect.sid'); 
        res.status(200).send('Logout successful');
    });
});

const PORT = 8081;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});