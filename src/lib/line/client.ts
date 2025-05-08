import { Client, FlexMessage } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

export const lineClient = new Client(config);

export const createGameStartMessage = (gameId: string): FlexMessage => ({
  type: 'flex',
  altText: 'オセロゲームを始めましょう',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'オセロゲーム',
          weight: 'bold',
          size: 'xl'
        },
        {
          type: 'text',
          text: 'ゲームモードを選択してください',
          margin: 'md'
        }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: 'CPU対戦',
            uri: `${process.env.NEXT_PUBLIC_BASE_URL}/game/${gameId}?mode=cpu`
          }
        },
        {
          type: 'button',
          style: 'secondary',
          action: {
            type: 'uri',
            label: '2人対戦',
            uri: `${process.env.NEXT_PUBLIC_BASE_URL}/game/${gameId}?mode=vs`
          }
        }
      ]
    }
  }
}); 