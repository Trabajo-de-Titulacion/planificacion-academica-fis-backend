import { Inject, Injectable } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import configuracion from "../configuracion";

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
    constructor(
        @Inject(configuracion.KEY) private configService: ConfigType<typeof configuracion>,
        ) { }

    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type: 'postgres',
            host: this.configService.database.host,
            database: this.configService.database.name,
            port: this.configService.database.databasePort,
            username: this.configService.database.username,
            password: this.configService.database.password,
            autoLoadEntities: true,
            synchronize: true,
            keepConnectionAlive: true,
        }
    }
}