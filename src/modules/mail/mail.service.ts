import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { MailJobInterface } from './interface/mail-job.interface';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(process.env.MAIL_QUEUE)
    private mailQueue: Queue,
  ) {}

  async sendMail(payload: MailJobInterface, type: string): Promise<boolean> {
    try {
      // console.log(type, payload);
      // const data = {
      //   name: 'test',
      // };
      await this.mailQueue.add(type, {
        payload,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
