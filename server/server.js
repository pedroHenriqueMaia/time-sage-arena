const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    console.log('Mensagem recebida:', message);
    
    // Verifica se a mensagem é uma string JSON e retransmite para todos os clientes
    try {
      const parsedMessage = JSON.parse(message);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (e) {
      console.error('Erro ao converter a mensagem para JSON:', e);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(8080, () => {
  console.log('Servidor WebSocket rodando na porta 8080');
});
