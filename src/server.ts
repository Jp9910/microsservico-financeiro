
import startConsumidorDeFilas from './mensageria/consumidor';
import ProcessarPagamento from './processamentos/ProcessarPagamento';

startConsumidorDeFilas(); // basta não usar o await na função que ela já roda como se fosse numa outra thread

// Testar processamento
// ProcessarPagamento({
//     idPedido: 1,
//     CodigoSegurancaCartao: 123, 
//     NumeroCartao: "1234 5678 9012 3456", 
//     DataExpiracaoCartao: "2030-01"
// });
