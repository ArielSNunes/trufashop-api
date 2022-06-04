import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PixCobranca, PixLoc } from 'src/pix/pix.types';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) { }

	@Post()
	async create(@Body() createOrderDto: CreateOrderDto): Promise<{ qrcode: PixLoc, cobranca: PixCobranca }> {
		const cobranca = await this.ordersService.create(createOrderDto)
		return cobranca
	}

	@Get()
	findAll() {
		return { res: 'ok' }
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(+id);
	}
}
