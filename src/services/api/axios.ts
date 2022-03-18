import axios from 'axios'


const domain = 'https://chat.altisss.vn/api/v1/'

declare type TRoom = {
  default: boolean;
  fname: string;
  msgs: number;
  name: string;
  ro: boolean;
  t: 'p' | 'c' | 'd' | 'teams';
  teamId: string;
  teamMain: boolean;
  u: { _id: string; username: string };
  usersCount: number;
  _id: string;
};

const config = {
  headers: {
    'X-Auth-Token': 'dkpZXwwxymDNrxlWNijgX89w0sZMx8BHLzDzcf8ISmw',
    'X-User-Id': 'rwD8GRfHhDTAPXvvF',
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
};
// axios.head('https://chat.altisss.vn', config)

const API_CHAT = {
  postMessage: async (roomId: string, text: string) => {
    try {
      const resp = await axios
        .post(
          `${domain}chat.postMessage`,
          {
            roomId: roomId || '@dungnguyen.nvd',
            text: text || '',
          },
          config,
        )
      console.log(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }
}

const API_MANAGE = {
  // getAllRoom: async (types: string[], text: string, current: number, itemsPerPage: number ): Promise<any> => {
  getAllRoom: async ({ types, text, current, itemsPerPage }: {
    types: string[],
    text: string,
    current: number,
    itemsPerPage: number
  }): Promise<any> => {
    try {
      const resp = await axios
        .get(
          `${domain}rooms.adminRooms`,
          {
            params: {
              types: types,
              filter: text,
              current,
              itemsPerPage,
            },
            headers: config.headers
          }
        )
      return {
        data: resp.data.rooms,
        success: resp.data.success,
        number: resp.data.total
      }
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  },
  getAllAccount: async () => {
    try {
      const resp = await axios
        .get(
          `${domain}user.list`,
          config,
        )
      console.log(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }
}



export { API_CHAT, API_MANAGE };