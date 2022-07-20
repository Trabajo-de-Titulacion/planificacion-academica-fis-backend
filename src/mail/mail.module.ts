import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
          },
        },
        defaults: {
          from: '"Planificacion Academica" <diana_flyff@hotmail.com>'
        },
        template: {
          dir: 'D:/Proyectos Codigo/TrabajoDeTitulacion/planificacion-academica-fis-backend/src/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      })
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
