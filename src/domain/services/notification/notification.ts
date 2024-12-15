import { User } from '@prisma/client';
import nodemailer from 'nodemailer';
import { EmailOptions } from 'src/domain/shared/types/notification';
import { env, isProduction } from 'src/infrastructure/config';
import { BadRequestError } from 'src/infrastructure/error';
import { logger } from 'src/infrastructure/logging';
import { currentTime, formattedUTCTime } from 'src/shared/utils/time';

export class NotificationService {
  private transporter: nodemailer.Transporter;
  private readonly emailFromName: string;
  private readonly emailFromId: string;
  private readonly appName: string;

  constructor() {
    this.emailFromName = env.EMAIL_FROM_NAME;
    this.emailFromId = env.EMAIL_FROM_ID;
    this.appName = env.APP_NAME;

    this.transporter = nodemailer.createTransport({
      host: env.SENDGRID_HOST,
      port: env.SENDGRID_PORT,
      auth: {
        user: env.SENDGRID_USER,
        pass: env.SENDGRID_API_KEY,
      },
    } as nodemailer.TransportOptions);
  }

  private async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    if (!isProduction) {
      logger.info('Email not sent in non-production environment');
      return;
    }

    await this.transporter.sendMail({
      from: `${this.emailFromName} <${this.emailFromId}>`,
      to,
      subject,
      html,
    });
  }

  async sendResetPasswordEmail(user: User, resetPasswordCode: string): Promise<void> {
    const message = `<p>Your password reset code is ${resetPasswordCode}</p>`;
    const html = `<h4>Hello, ${user.name}</h4> ${message}`;

    if (!user.email) {
      logger.error('Recipient email is required');
      throw new BadRequestError('Recipient email is required');
    }

    await this.sendEmail({
      to: user.email,
      subject: `${this.appName} Reset Password Code`,
      html,
    });
  }

  async sendVerificationEmail(user: User, verificationCode: string): Promise<void> {
    const message = `<p>Your email verification code is ${verificationCode}</p>`;
    const html = `<h4>Hello, ${user.name}</h4> ${message}`;

    if (!user.email) {
      logger.error('Recipient email is required');
      throw new BadRequestError('Recipient email is required');
    }

    await this.sendEmail({
      to: user.email,
      subject: `${this.appName} Email Confirmation Code`,
      html,
    });
  }

  async sendLoginAlertNotificationEmail(user: User): Promise<void> {
    const message = `<p>Your account has been logged in on ${formattedUTCTime(currentTime())} UTC time</p>`;
    const html = `<h4>Hello, ${user.name}</h4> ${message}`;

    if (!user.email) {
      logger.error('Recipient email is required');
      throw new BadRequestError('Recipient email is required');
    }

    await this.sendEmail({
      to: user.email,
      subject: `${this.appName} Login Alert`,
      html,
    });
  }
}
