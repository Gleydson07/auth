import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { SendMailDto } from "./dto/send-mail.dto";
var nodemailer = require('nodemailer');

@Injectable()
export class MailerService {
  constructor (private readonly configService: ConfigService) {}

  mailTransaporter() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>("MAIL_HOST"),
      port: Number(this.configService.get<number>("MAIL_PORT") || 465),
      secure: Boolean(this.configService.get<string>("MAIL_SECURE") || true),
      auth: {
        user: this.configService.get<string>("MAIL_DEFAULT_SENDER"),
        pass: this.configService.get<string>("MAIL_PASS")
      },
    });

    return transporter;
  }

  async sendMail(sendMail: SendMailDto) {
    try {
      const transporter = this.mailTransaporter();

      await transporter.sendMail({
        from: sendMail.from,
        to: sendMail.recipients,
        subject: sendMail.subject,
        text: sendMail.text,
        html: sendMail.html
      });
    } catch (error) {
      throw new HttpException(error?.message || "Falha no envio de e-mail!", HttpStatus.BAD_REQUEST);
    }
  }
}
