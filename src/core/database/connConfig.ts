import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const {
	DB_TYPE,
	DATABASE_URL,
	DB_DATABASE,
	// DB_USER,
	// DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_SYNCHRONIZE,
} = process.env;

const synchronize = DB_SYNCHRONIZE !== 'true';
const dataSource = (): DataSource => {
	if (!process.env.prod) {
		return new DataSource({
			type: DB_TYPE as any,
			// url: DATABASE_URL,
			host: DB_HOST,
			database: DB_DATABASE,
			// username: DB_USER,
			// password: DB_PASSWORD,
			port: Number(DB_PORT),
			entities: ['dist/**/*.entity{.ts,.js}'],
			synchronize: true,
			logging: true,
		});
	}

	return new DataSource({
		type: DB_TYPE as any,
		url: DATABASE_URL,
		ssl: true,
		logging: true,
		synchronize,
		entities: ['dist/**/*.entity{.ts,.js}'],
		extra: {
			// options: routingId,
		},
	});
}

export default dataSource;
