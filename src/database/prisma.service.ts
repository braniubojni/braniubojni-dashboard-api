import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Connected to DB');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PrismaService] DB connect error');
			}
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.$disconnect();
			this.logger.log('[PrismaService] Disconnected to DB');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(`[PrismaService] DB connect error: ${e.message}`);
			}
		}
	}
}
