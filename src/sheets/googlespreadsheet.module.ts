import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleSpreadsheetProvider } from './googlespreadsheet.provider';

@Global()
@Module({})
export class GoogleSpreadsheetModule {
    static forRoot(): DynamicModule {
        const connectionFactory = {
            provide: 'SheetProvider',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => new GoogleSpreadsheetProvider(
                configService
            )
        }
        return {
            module: GoogleSpreadsheetModule,
            providers: [connectionFactory],
            exports: ['SheetProvider']
        }
    }
}
