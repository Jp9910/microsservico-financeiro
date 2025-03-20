import amqp from 'amqplib';
import "dotenv/config";
import IDadosPagamento from '../processamentos/IDadosPagamento';
import ProcessarPagamento from '../processamentos/ProcessarPagamento';

const fila = "filaPagamentosAProcessar";
// const exchange = "exchangePedidosFeitos";
// In RabbitMQ, you don’t actually have to declare an exchange when consuming a message from a queue. Consumers only need to
// specify the queue they are subscribing to. However, when setting up the messaging topology (i.e., defining how messages flow), 
// you often declare both exchanges and queues to ensure they exist before using them.
let tentativaConexao = 0;

export default async function startConsumidor() {
    try {
        tentativaConexao += 1;
        console.log(`➡️ [Consumidor] Tentativa ${tentativaConexao} - Conectando com o RabbitMQ...`);
        const conexao = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: Number(process.env.RABBITMQ_PORT) || 5672,
            username: process.env.RABBITMQ_USERNAME || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest',
            frameMax: 0,
            heartbeat: 10,
            vhost: '/',
        });
        tentativaConexao = 0;

        conexao.on("error", (err) => {
            console.error("🔴 [Consumidor] Erro na conexão com o RabbitMQ: ", err.message);
            reconectar();
        });

        conexao.on("close", () => {
            console.error("🔴 [Consumidor] Conexão RabbitMQ fechada.");
            reconectar();
        });

        console.log("✅ [Consumidor] Conexão criada...\n");
        const canal = await conexao.createChannel();
        await canal.assertQueue(fila, { durable: true });
        // await canal.assertExchange(exchange, 'fanout', { durable: true });
        // await canal.bindQueue(fila, exchange, '');

        console.log("➡️ [Consumidor] Escutando por mensagens...");

        canal.consume(fila, async (msg) => {
            if (msg !== null) {
                const conteudo = msg.content.toString();
                console.log(`📨 [Consumidor] Mensagem Recebida: ${conteudo}`);
                const msgPagamento: IDadosPagamento = JSON.parse(conteudo);
                ProcessarPagamento(msgPagamento);
                canal.ack(msg);
            }
        }, { noAck: false });
        /**
         * Sobre o noAck:
         * if true, the broker won’t expect an acknowledgement of messages delivered to this
         * consumer; i.e., it will dequeue messages as soon as they’ve been sent down the wire. 
         * Defaults to false (i.e., you will be expected to acknowledge messages).
         */

    } catch (error:unknown) {
        console.error('🔴 [Consumidor] Erro:', error);
        reconectar();
    }
}

async function reconectar() {
    console.log("⚠️ [Consumidor] Tentando reconexão em 5 segundos...");
    setTimeout(startConsumidor, 5000);
}