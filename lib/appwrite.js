import {Client , Account, Avatars} from 'react-native-appwrite';

export const client = new Client()
    .setProject('6840c253000d5202499d')
    .setPlatform('dev.css.cwaprojector');

export const account = new Account(client)
export const avatars = new Avatars(client)