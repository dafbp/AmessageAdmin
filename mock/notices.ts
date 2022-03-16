import { Request, Response } from 'express';

const getNotices = (req: Request, res: Response) => {
  res.json({
    data: [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: 'You received 14 new weekly reports',
        datetime: '2017-08-09',
        type: 'notification',
      },
      {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: 'Your recommended tunnie has passed the third round of interview',
        datetime: '2017-08-08',
        type: 'notification',
      },
      {
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        title: 'This template can distinguish a variety of notification types',
        datetime: '2017-08-07',
        read: true,
        type: 'notification',
      },
      {
        id: '000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'The left icon is used to distinguish different types',
        datetime: '2017-08-07',
        type: 'notification',
      },
      {
        id: '000000005',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: 'Dont exceed two lines of words, automatic truncation is exceeded.',
        datetime: '2017-08-07',
        type: 'notification',
      },
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Jusi Li commented you',
        description: 'Description Information Description Information Description Information',
        datetime: '2017-08-07',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Zhu Night Reply to you',
        description:
          'This type of template is used to remind you to interact with you, put "who" on the left side "Who"',
        datetime: '2017-08-07',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'title',
        description:
          'This type of template is used to remind you to interact with you, put "who" on the left side "Who"',
        datetime: '2017-08-07',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000009',
        title: 'mission name',
        description: 'Task needs 2017-01-12 20:00 Before start',
        extra: 'has not started',
        status: 'todo',
        type: 'event',
      },
      {
        id: '000000010',
        title: 'Third party emergency code change',
        description:
          'Guan Lin submitted 2017-01-06, need to 2017-01-07 Pre-completion code change task',
        extra: 'Immediately expire',
        status: 'urgent',
        type: 'event',
      },
      {
        id: '000000011',
        title: 'Information security test',
        description: 'Architecture 2017-01-09 Complete the update and release',
        extra: 'Time consumption 8 sky',
        status: 'doing',
        type: 'event',
      },
      {
        id: '000000012',
        title: 'ABCD Version release',
        description:
          'Guan Lin submitted 2017-01-06, need to 2017-01-07 Pre-completion code change task',
        extra: 'in progress',
        status: 'processing',
        type: 'event',
      },
    ],
  });
};

export default {
  'GET /api/notices': getNotices,
};
