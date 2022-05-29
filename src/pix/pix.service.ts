import { Injectable } from "@nestjs/common"
import { PixCobranca, PixCredentials, PixGetTokenData, PixLoc, PixToken } from "./pix.types"
import axios, { AxiosRequestConfig } from 'axios'
import https from 'https'

export type PixServiceConstructor = {
	certificate: Buffer
	credentials: PixCredentials
}

@Injectable()
export class PixService {
	private _token: PixToken | null = null
	private _certificate: Buffer | null = null
	private _credentials: PixCredentials | null = null

	constructor(
		{ certificate, credentials }: PixServiceConstructor
	) {
		this._certificate = certificate
		this._credentials = credentials
	}

	/**
	 * Função responsável por gerar o hash das credenciais
	 */
	encryptCredentails(): string {
		return Buffer.from(
			[
				this._credentials.client_id,
				':',
				this._credentials.client_secret
			].join('')
		).toString('base64')
	}

	/**
	 * Função responsável por retornar a URL do ambiente
	 */
	getBaseUrl(env: string): string {
		const urls = {
			producao: 'https://api-pix.gerencianet.com.br',
			homologacao: 'https://api-pix-h.gerencianet.com.br'
		}
		if (urls[env]) return urls[env]
		return urls.homologacao
	}

	/**
	 * Função responsável por fazer a requisição e capturar o token de
	 * autenticação
	 */
	private async _getToken(data: PixGetTokenData): Promise<void> {
		try {
			/**
			 * Agente Https com informações do certificado
			 */
			const agent = new https.Agent({
				pfx: this._certificate,
				passphrase: ''
			})
			/**
			 * Configuração do Axios
			 */
			const axiosConfig: AxiosRequestConfig<PixGetTokenData> = {
				method: 'POST',
				url: this.getBaseUrl(process.env.GN_ENV) + '/oauth/token',
				headers: {
					Authorization: `Basic ${this.encryptCredentails()}`,
					'Content-type': 'application/json'
				},
				httpsAgent: agent,
				data
			}
			/**
			 * Resposta da requisição
			 */
			const response = await axios(axiosConfig)

			/**
			 * Dados da requisição
			 */
			const json = (response.data) as PixToken
			this._token = json
		} catch (error) {
			this._token = null
			console.log(error)
			console.log('Ocorreu um erro')
		}
	}

	/**
	 * Função responsável por fazer a requisição e capturar o token de
	 * autenticação
	 */
	public async getToken(data: PixGetTokenData): Promise<PixToken> {
		await this._getToken(data)
		return this._token
	}
	/**
	 * Função responsável por criar a cobrança via Pix
	 */
	async askForPix(cobranca: PixCobranca): Promise<PixCobranca> {
		try {
			if (!this?._token?.access_token) {
				throw new Error('Falha ao capturar token')
			}
			/**
			 * Agente Https com informações do certificado
			 */
			const agent = new https.Agent({
				pfx: this._certificate,
				passphrase: ''
			})
			/**
			 * Configuração do Axios
			 */
			const axiosConfig: AxiosRequestConfig = {
				method: 'POST',
				url: this.getBaseUrl(process.env.GN_ENV) + '/v2/cob',
				headers: {
					Authorization: `Bearer ${this._token.access_token}`,
					'Content-type': 'application/json'
				},
				httpsAgent: agent,
				data: cobranca
			}
			/**
			 * Resposta da requisição
			 */
			const response = await axios(axiosConfig)
			return (response.data as PixCobranca)
		} catch (error) {
			this._token = null
			console.log(error)
			console.log('Ocorreu um erro')
		}
	}

	/**
	 * Função responsável por capturar os dados do qrcode da cobrança
	 */
	async getLocData(cobranca: PixCobranca): Promise<PixLoc> {
		const { id } = cobranca.loc
		try {
			if (!this?._token?.access_token) {
				throw new Error('Falha ao capturar token')
			}
			/**
			 * Agente Https com informações do certificado
			 */
			const agent = new https.Agent({
				pfx: this._certificate,
				passphrase: ''
			})
			/**
			 * Configuração do Axios
			 */
			const axiosConfig: AxiosRequestConfig = {
				method: 'GET',
				url: this.getBaseUrl(process.env.GN_ENV) + `/v2/loc/${id}/qrcode`,
				headers: {
					Authorization: `Bearer ${this._token.access_token}`,
					'Content-type': 'application/json'
				},
				httpsAgent: agent,
				data: cobranca
			}
			/**
			 * Resposta da requisição
			 */
			const response = await axios(axiosConfig)
			return response.data
		} catch (error) {
			this._token = null
			console.log(error)
			console.log('Ocorreu um erro')
		}
	}
}
