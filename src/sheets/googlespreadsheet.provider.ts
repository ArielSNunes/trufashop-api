import fs from 'fs'
import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GoogleSpreadsheet } from 'google-spreadsheet'

@Injectable()
export class GoogleSpreadsheetProvider {
	private readonly logger: Logger
	private readonly doc: GoogleSpreadsheet

	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger('GoogleSpreadsheetProvider')
		this.logger.log('Provider initialized!')

		this.doc = new GoogleSpreadsheet(
			this.configService.get<string>('GOOGLE_SHEET_ID')
		)
		this.initDoc()
	}

	async initDoc(): Promise<void> {
		this.logger.log('InitDoc Called')

		await this.doc.useServiceAccountAuth({
			client_email: this.configService.get<string>('EMAIL_GOOGLE_API'),
			private_key: this.configService.get<string>('GOOGLE_SHEET_PRIVATE_KEY')
				.replace(/\\n/g, "\n")
		})

		await this.doc.loadInfo()
	}
	getDoc(): GoogleSpreadsheet {
		return this.doc
	}
}
