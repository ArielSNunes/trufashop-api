import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) { }

	@Post()
	create(@Body() createOrderDto: CreateOrderDto) {
		this.ordersService.create(createOrderDto)
		return createOrderDto
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
