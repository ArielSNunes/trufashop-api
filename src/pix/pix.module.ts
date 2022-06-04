import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PixProvider } from './pix.provider';

@Global()
@Module({})
export class PixModule {
	static forRoot() {
		const connectionFactory = {
			provide: 'PixProvider',
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => new PixProvider(
				configService
			)
		}
		return {
			module: PixModule,
			providers: [connectionFactory],
			exports: ['PixProvider']
		}
	}
}
