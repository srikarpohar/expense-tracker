import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class LoggerService {
    private readonly logger: Logger;

    constructor(
       @Inject() private configService: ConfigService
    ) {
        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [
                new transports.File({
                    filename: this.configService.get<string>("logsPath"),
                    format: format.combine(
                        format.timestamp(),
                        format.prettyPrint()
                    )
                }),
            ],
        })
    }

    info(message: string) {
        this.logger.info(message);
    }

    error(message: string) {
        this.logger.error(message);
    }

    warning(message: string) {
        this.logger.warn(message);
    }
}
