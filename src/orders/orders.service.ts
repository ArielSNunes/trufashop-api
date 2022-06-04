import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PixProvider } from 'src/pix/pix.provider'
import { PixCobranca, PixGetTokenData, PixLoc } from 'src/pix/pix.types'
import { GoogleSpreadsheetProvider } from 'src/sheets/googlespreadsheet.provider'
import { v4 } from 'uuid'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
	constructor(
		@Inject('SheetProvider') private readonly sheetProvider: GoogleSpreadsheetProvider,
		@Inject('PixProvider') private readonly pixProvider: PixProvider,
		private readonly configService: ConfigService
	) { }
	async create(createOrderDto: CreateOrderDto): Promise<{ qrcode: PixLoc, cobranca: PixCobranca } | null> {
		try {
			const doc = this.sheetProvider.getDoc()
			await doc.loadInfo()
			const sheet = doc.sheetsByTitle['Pedidos']
			const orderId = v4()
			const orderItems = createOrderDto.products.map(product => {
				return ({
					'Pedido': orderId,
					'Nome do Cliente': createOrderDto.nome,
					'Telefone do Cliente': createOrderDto.telefone,
					'Produto': product.name,
					'Valor Unitário': product.price,
					'Quantidade': product.qtd,
					'Subtotal': product.total,
					'Total do Pedido': product.orderTotal,
					'Status': 'Aguardando Pagamento',
					'CPF': createOrderDto.cpf
				})
			})

			const pixData: PixGetTokenData = {
				grant_type: 'client_credentials'
			}
			const pix = this.pixProvider.getPix()

			await pix.getToken(pixData)

			const textoCobranca = 'Resumo do pedido: '.concat(
				orderItems.map(item => {
					return `Item: ${item['Produto']} (${item['Quantidade']})`
				}).join(', ')
			)
			const detalhesCobranca: PixCobranca = {
				calendario: { expiracao: 3600 },
				devedor: {
					cpf: createOrderDto.cpf,
					nome: createOrderDto.nome
				},
				valor: {
					original: orderItems[0]['Total do Pedido']
				},
				chave: this.configService.get<string>('GN_CHAVE_PIX'),
				solicitacaoPagador: textoCobranca
			}
			const cobranca = await pix.askForPix(detalhesCobranca)

			const qrcode = await pix.getLocData(cobranca)

			await sheet.addRows(orderItems.map(order => ({
				...order,
				'Pedido': cobranca.txid
			})))

			return { qrcode, cobranca }
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro ao salvar pedido e gerar pix'
			)
		}

	}

	findAll() {
		return `This action returns all orders`;
	}

	findOne(id: number) {
		return `This action returns a #${id} order`;
	}

	remove(id: number) {
		return `This action removes a #${id} order`;
	}
}
