/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WhatsappTemplateDto } from './whatsapp-template.dto';


@Injectable()
export class WhatsappService {
  async sendMessage(
    messageData: WhatsappTemplateDto,
  ): Promise<WhatsappTemplateDto> {
    console.log('messageData', messageData);
    const response = await axios.post(
      'https://appwhatsapp.vitar.es/Bots/WhatsappServiceTemplate',
      messageData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('response.data', response.data);
    return response.data;
  }
  catch(error: {
    response: { data: string | Record<string, any>; status: number };
    request: any;
    message: string | Record<string, any>;
  }) {
    if (error) {
      console.log(error.message);
    }
  }

}
