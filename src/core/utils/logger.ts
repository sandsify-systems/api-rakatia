import winston, { format, transports } from 'winston';
import log4js from 'log4js';

const logger = winston.createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		new winston.transports.File({
			filename: 'error.log',
			level: 'error',
		}),
	],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf(
					(info) => `${info.timestamp} ${info.level}: ${info.message}`
				)
			),
			level: 'error',
		})
	);
}

log4js.addLayout(
	'json',
	(config) => (logEvent) => `${JSON.stringify(logEvent)} ${config.separator}`
);

log4js.configure({
	appenders: {
		console: {
			type: 'console',
			// filename: 'error.log',
			layout: {
				type: 'pattern',
				pattern: '%[%d{ISO8601_WITH_TZ_OFFSET} %p %c -%] %m',
			},
		},
		err: {
			type: 'file',
			filename: 'error.log',
			layout: { type: 'json', separator: ',' },
		},
	},
	categories: {
		default: { appenders: ['console'], level: 'info' },
		error: { appenders: ['err'], level: 'error' },
	},
});

export const log = log4js.getLogger();
export const logEr = log4js.getLogger('error');

export default logger;
export const { info, error } = logger;