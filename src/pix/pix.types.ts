export type PixToken = {
	/** Token de acesso */
	access_token: string
	/** Tipo do token */
	token_type: string
	/** Tempo restante para expiração */
	expires_in: string
	/** Atribuições do token */
	scope: string
}

export type PixCredentials = {
	/** Client id do ambiente */
	client_id: string
	/** Client secret do ambiente */
	client_secret: string
}

export type PixGetTokenData = {
	/** Tipo da operação */
	grant_type: string
}

export type PixCalendario = {
	/** Tempo para expiração da cobrança */
	expiracao: number
	/** Horário da criação da cobrança */
	criacao: string
}

export type PixLoc = {
	/** Id da location */
	id: number
	/** URL do QRCode */
	location: string
	/** Tipo da cobrança */
	tipoCob: string
	/** Data da cobrança */
	criacao: string
}
export type PixDevedor = {
	/** CPF do devedor */
	cpf: string
	/** Nome do devedor */
	nome: string
}

export type PixValor = {
	/** Valor original da cobrança, com decimal separado por . */
	original: string
}
export type PixCobranca = {
	calendario: PixCalendario
	/** Id da transaçào, caso não informado, é gerado pela GerenciaNet */
	txid: string
	loc: PixLoc
	/** Revisão da transação PIX */
	revisao: number
	/** URL do QRCode */
	location: string
	devedor: PixDevedor
	/** Chave Pix que recebe o valor */
	chave: string
	/** Descrição da cobrança */
	solicitacaoPagador: string
}
