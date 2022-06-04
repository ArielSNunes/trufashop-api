import * as fs from 'fs'
import * as path from 'path'
import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { PixService, PixServiceConstructor } from './pix.service'

@Injectable()
export class PixProvider {
	private readonly logger: Logger
	private readonly pixService: PixService


	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger('PixProvider')
		this.logger.log('Provider initialized!')
		const certificatePath = path.resolve(
			process.cwd(),
			this.configService.get<string>('GN_CERTIFICATE_FILE')
		)

		const pixConfig: PixServiceConstructor = {
			certificate: fs.readFileSync(certificatePath),
			credentials: {
				client_id: this.configService.get<string>('GN_CLIENT_ID'),
				client_secret: this.configService.get<string>('GN_CLIENT_SECRET')
			}
		}

		this.pixService = new PixService(pixConfig)
	}

	getPix() {
		return this.pixService
	}
}
