import Mensageiro from "../mensageria/mensageiro";
import IDadosPagamento from "./IDadosPagamento";

const TEMPO_ESPERA = 7000

export default async function ProcessarPagamento (dados: IDadosPagamento) {
    console.log(`Dados de pagamento recebidos:
        \t Id pedido: ${dados.IdPedido}
        \t Numero cartão: ${dados.NumeroCartao}
        \t Data expiracao: ${dados.DataExpiracaoCartao}
        \t Codigo seguranca: ${dados.CodigoSegurancaCartao}
    `)
    // console.log("... Iniciando processamento do pagamento")
    console.log("➡️ Processando pagamento...")
    setTimeout(() => {
        console.log("Pagamento aceito! Enviando mensagem para alteração do status do pedido")
        Mensageiro.Instance.enviarMensagemMudarStatusPedido({idPedido: dados.IdPedido, status: "Pagamento aceito"})
    }, TEMPO_ESPERA);
}