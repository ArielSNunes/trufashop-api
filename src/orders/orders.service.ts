import { Inject, Injectable } from '@nestjs/common';
import { GoogleSpreadsheetProvider } from 'src/sheets/googlespreadsheet.provider';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
	constructor(
		@Inject('SheetProvider') private readonly sheetProvider: GoogleSpreadsheetProvider
	) { }
	async create(createOrderDto: CreateOrderDto) {
		const doc = this.sheetProvider.getDoc()
		await doc.loadInfo()
		console.log(doc.sheetsByTitle['Pedidos'])
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
