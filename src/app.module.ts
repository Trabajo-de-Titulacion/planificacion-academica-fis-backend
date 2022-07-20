import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocenteModule } from './docentes/docentes.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocenteModule,
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
        ssl: true,
        keepConnectionAlive: true,
      }
    ),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
