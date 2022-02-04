import nodeMailer from 'nodemailer';
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
    await this.transporter.sendMail({
      from: this.user,
      to,
      subject: `Активация аккаунта на SHADOW FORUM.`,
      text: '',
      html:
        `
          <div>
            <h1>Для активации перейдите по следующей ссылке:</h1>
            <a href='${link}' >${link}</a>
          </div>    
        `,
    });
  }
}

export default new MailService();
