import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailJobInterface } from './interface/mail-job.interface';

@Processor(process.env.MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('system-mail')
  async sendEmail(
    job: Job<{
      payload: MailJobInterface;
    }>,
  ): Promise<any> {
    this.logger.log(`Sending email to '${job.data.payload.to}'`);
    try {
      const options: Record<string, any> = {
        to: job.data.payload.to,
        from: process.env.MAIL_FROM,
        subject: job.data.payload.subject,
        context: job.data.payload.context,
      };
      return await this.mailerService.sendMail({ ...options });
    } catch (err) {
      this.logger.error(
        `Failed to send email to '${job.data.payload.to}'`,
        err.stack,
      );
      throw err;
    }
  }
}
