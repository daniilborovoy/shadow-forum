import nodeMailer from 'nodemailer';
import path from 'path';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class MailService {
  private readonly transporter: nodeMailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly host: string | undefined;
  private readonly port: number | undefined;
  private readonly user: string | undefined;
  private readonly pass: string | undefined;

  constructor() {
    this.host = process.env.SMTP_HOST;
    this.port = Number(process.env.SMTP_PORT);
    this.user = process.env.SMTP_USER;
    this.pass = process.env.SMTP_PASSWORD;
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      host: this.host,
      port: this.port,
      secure: false,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    const html = await readFile(path.join(__dirname, '..', 'templates', 'activationMessage.hbs'), 'utf-8');
    let template = handlebars.compile(html);
    let htmlToSend = template({ link });
    await this.transporter.sendMail({
      from: this.user,
      to,
      subject: `Активация аккаунта на SHADOW FORUM.`,
      text: '',
      html: htmlToSend,
    });
  }
}

export default new MailService();
