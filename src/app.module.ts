import { GoogleSpreadsheetModule } from './sheets/googlespreadsheet.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { PixModule } from './pix/pix.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.homologacao', '.env.producao']
		}),
		GoogleSpreadsheetModule.forRoot(),
		PixModule.forRoot(),
		OrdersModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
