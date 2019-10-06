const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


const connectedUsers = {}

io.on('connection', socket => {
	const { user } = socket.handshake.query

	connectedUsers[user] =  socket.id
})

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-0gotz.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', function () {
 	console.log('===== Conexão estabelecida com sucesso =====');
});
mongoose.connection.on('error', function (err) {
 	console.log('===== Ocorreu um erro: ' + err);
});
mongoose.connection.on('disconnected', function () {
 	console.log('===== Conexão finalizada =====');
});

app.use((req, res, next) => {
	req.io = io
	req.connectedUsers = connectedUsers

	return next()
})

app.use(cors()) 
app.use(express.json())
app.use(routes)

server.listen(3333)