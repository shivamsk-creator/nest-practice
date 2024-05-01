import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
    constructor(
        private mailerService: MailerService,
    ) { }

    async verification(email: string, otp: any, name: any) {
        try {
            return await this.mailerService
                .sendMail({
                    to: `${email}`,
                    from: process.env.EMAIL,
                    subject: 'Verify User',
                    template: 'otp-verification',
                    context: {
                        OTP: `${otp}`,
                        NAME: `${name}`
                    }
                });
        } catch (error) {
            throw error
        }
    }

    async generateOtp() {
        try {
            return Math.floor(1000 + Math.random() * 9000);
        } catch (error) {
            throw error
        }
    }

    async encriptPass(pass: string) {
        try {
            const saltOrRounds = 10;
            const password = pass;
            return await bcrypt.hash(password, saltOrRounds);
        } catch (error) {
            throw error
        }
    }

    async bcriptPass(old_password, user_pass) {
        try {
            return await bcrypt.compare(old_password, user_pass);
        } catch (error) {
            throw error
        }
    }
}