import nodeMailer from 'nodemailer';
import path from 'path';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class MailService {
  private transporter: nodeMailer.Transporter<SMTPTransport.SentMessageInfo>;
  private host: string | undefined = process.env.SMTP_HOST;
  private port: number | undefined = Number(process.env.SMTP_PORT);
  private user: string | undefined = process.env.SMTP_USER;
  private pass: string | undefined = process.env.SMTP_PASSWORD;

  constructor() {
    this.transporter = nodeMailer.createTransport({
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
