// Serveur WebSocket pour le mode multijoueur en ligne
// Installation: npm install express socket.io
// Lancement: node server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Stockage des salles de jeu
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('Nouveau client connecté:', socket.id);

    // Créer une salle
    socket.on('createRoom', (roomId) => {
        rooms.set(roomId, {
            players: [socket.id],
            host: socket.id,
            game: null,
            currentPlayer: 'X'
        });
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        console.log(`Salle créée: ${roomId} par ${socket.id}`);
    });

    // Rejoindre une salle
    socket.on('joinRoom', (roomId) => {
        const room = rooms.get(roomId);
        if (!room) {
            socket.emit('error', 'Salle introuvable');
            return;
        }
        if (room.players.length >= 2) {
            socket.emit('error', 'Salle pleine');
            return;
        }
        
        room.players.push(socket.id);
        socket.join(roomId);
        socket.emit('roomJoined', roomId);
        
        // Notifier tous les joueurs que la partie peut commencer
        io.to(roomId).emit('gameStart', {
            players: room.players.length,
            currentPlayer: 'X'
        });
        
        console.log(`Joueur ${socket.id} a rejoint la salle ${roomId}`);
    });

    // Envoyer un coup
    socket.on('move', (data) => {
        const { roomId, index, player } = data;
        const room = rooms.get(roomId);
        
        if (!room) {
            socket.emit('error', 'Salle introuvable');
            return;
        }
        
        // Transmettre le coup à tous les joueurs de la salle
        socket.to(roomId).emit('moveReceived', {
            index,
            player
        });
    });

    // Redémarrer la partie
    socket.on('restart', (roomId) => {
        const room = rooms.get(roomId);
        if (room && room.host === socket.id) {
            io.to(roomId).emit('gameRestart');
        }
    });

    // Déconnexion
    socket.on('disconnect', () => {
        console.log('Client déconnecté:', socket.id);
        
        // Nettoyer les salles
        for (const [roomId, room] of rooms.entries()) {
            const index = room.players.indexOf(socket.id);
            if (index > -1) {
                room.players.splice(index, 1);
                if (room.players.length === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('playerLeft');
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
    console.log(`Accédez à http://localhost:${PORT} pour jouer`);
});

