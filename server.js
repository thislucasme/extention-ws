// server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Lista para armazenar todas as conexões de clientes
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Adiciona o cliente à lista de clientes
  clients.add(ws);

  // Envia uma mensagem para o cliente assim que a conexão é estabelecida
  ws.send('Bem-vindo ao servidor WebSocket!');

  // Define um ouvinte para mensagens do cliente
  ws.on('message', (message) => {
    console.log(`Mensagem recebida do cliente: ${message}`);
    
    // Envia a mensagem para todos os clientes conectados
    broadcast(message);
  });

  // Define um ouvinte para eventos de fechamento da conexão
  ws.on('close', () => {
    console.log('Cliente desconectado');

    // Remove o cliente da lista de clientes ao desconectar
    clients.delete(ws);
  });
});

// Função para enviar mensagens para todos os clientes
function broadcast(message) {
  clients.forEach((client) => {
    // Certifica-se de que a conexão ainda está aberta antes de enviar
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Inicia o servidor em uma porta específica
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket está ouvindo na porta ${PORT}`);
});
