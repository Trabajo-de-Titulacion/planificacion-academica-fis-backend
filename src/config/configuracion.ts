import { registerAs } from "@nestjs/config";

export default registerAs('configuracion', () => {
    return {
        database: {
            host: process.env.SPA_DB_HOST,
            name: process.env.SPA_DB_DATABASE,
            databasePort: parseInt(process.env.SPA_DB_PORT),
            username: process.env.SPA_DB_USERNAME,
            password: process.env.SPA_DB_PASSWORD,
        },
        http: {
            port: 3000,
        },
        apiKey: process.env.API_KEY,
        jwtSecret: process.env.JWT_SECRET,
    }
})