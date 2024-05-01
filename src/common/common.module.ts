import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CommonService } from './common.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            // signOptions: { expiresIn: '86400s' },
        }),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.hostinger.com',
                port: 465,
                // secure: false,
                auth: {
                    // user: process.env.ZEPTO_USER,
                    user: 'shivam.kushwaha.dev@seeksolution.in',
                    pass: 'Joker@4455',
                },
                // host: 'smtppro.zoho.eu',
                // auth: {
                //     user: process.env.EMAIL,
                //     pass: process.env.PASSWORD,
                // }
            },
            template: {
                dir: process.cwd() + '/dist/template/',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [],
    exports: [CommonService]
})
export class CommonModule { }
