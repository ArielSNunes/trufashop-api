import { Inject, Injectable } from '@nestjs/common'
import { GoogleSpreadsheetProvider } from 'src/sheets/googlespreadsheet.provider'
import { v4 } from 'uuid'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
	constructor(
		@Inject('SheetProvider') private readonly sheetProvider: GoogleSpreadsheetProvider
	) { }
	async create(createOrderDto: CreateOrderDto) {
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

		await sheet.addRows(orderItems)
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
