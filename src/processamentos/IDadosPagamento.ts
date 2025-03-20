export default interface IDadosPagamento {
    // prestar atenção no casing. o nome precisa ser exatamente igual ao que vai ser enviado pelo outro microsserviço
    IdPedido: number,  //exemplo: 97
    NumeroCartao: string, // exemplo: 1234 1234 1234 1234
    DataExpiracaoCartao: string, // exemplo: 2030-02
    CodigoSegurancaCartao: number // exemplo: 123
}