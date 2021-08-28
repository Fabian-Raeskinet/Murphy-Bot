import axios, { AxiosResponse } from 'axios';
import { CreateGuildDto } from '../../../dtos/guild/create_guild';

export const CreateGuild = async (createGuildDto: CreateGuildDto): Promise<boolean> => {
  try {
    console.log('axios config');

    const url = 'https://62d5-85-27-28-1.eu.ngrok.io/api/guilds';
    const response = await axios.post(url, createGuildDto);

    return true;
  } catch (error) {
    if (error.response) {
      console.error('erreur', error);
    }
  }
};
