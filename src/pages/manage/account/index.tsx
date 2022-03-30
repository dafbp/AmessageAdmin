import { API_MANAGE } from '@/services/api/axios';
import { IUser } from '@/types/user/user';
import { EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Avatar,
  Button,
  Checkbox,
  Descriptions,
  Divider,
  Drawer,
  message,
  Row,
  Typography,
  Upload,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useRequest } from 'umi';
import type { TableListPagination } from './data';
import { getListUserBroker, removeRule } from './service';
import { domain, config } from '@/services/api/axios';

const { Paragraph } = Typography;

const updateUserInfo = async (body: API.UpdateUserInfo, currentRow?: IUser) => {
  const hide = message.loading('Đang chỉnh sửa');
  try {
    await API_MANAGE.updateUserInfo(body);
    hide();
    message.success('Configure success');
    return true;
  } catch (error) {
    hide();
    message.error('If you fail, please try again!');
    return false;
  }
};
const resetAvatarToDefault = async (body: { userId: string }) => {
  const hide = message.loading('Đang chỉnh sửa');
  try {
    await API_MANAGE.resetAvatarToDefault(body);
    hide();
    message.success('Thay đổi avatar mặc định thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thay đổi avatar mặc định thất bại');
    return false;
  }
};
/**
 * Delete node
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: IUser[]) => {
  const hide = message.loading('deleting');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Delete success, will be refreshed');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

function getBase64(img: any, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const TableList: React.FC = () => {
  /** New window population */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** Distributed update window pop-up window */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<IUser>();
  const [selectedRowsState, setSelectedRows] = useState<IUser[]>([]);
  const [onlyBroker, setOnlyBroker] = useState(false);
  /** International allocation */
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const columns: ProColumns<IUser>[] = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (src, row) => (
        <Avatar size="small" src={`https://chat.altisss.vn/avatar/${row.username}`} />
      ),
    },
    {
      title: 'name',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'nickname',
      dataIndex: 'nickname',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: 'username',
      dataIndex: 'username',
      hideInTable: true,
    },
    {
      title: 'email',
      dataIndex: 'emails',
      renderText: (val) => {
        return val[0]?.address;
      },
    },
    {
      title: 'verify',
      dataIndex: 'emails',
      renderText: (val: IUser['emails'], entity) => {
        return <Checkbox defaultChecked={val[0]?.verified} disabled />;
      },
    },
    {
      title: 'FosId',
      dataIndex: 'FosId',
      hideInTable: true,
    },
    {
      title: 'TradingAccount',
      dataIndex: 'TradingAccount',
      hideInTable: true,
    },
    {
      title: 'bio',
      dataIndex: 'bio',
      hideInTable: true,
    },
    {
      title: 'broker',
      dataIndex: 'customFields',
      renderText: (val: IUser['customFields']) => {
        return val?.broker;
      },
    },
    {
      title: 'phone',
      dataIndex: 'customFields',
      // valueType: 'textarea',
      renderText: (val: IUser['customFields']) => {
        return val?.phone;
      },
    },
    {
      title: 'roles',
      dataIndex: 'roles',
      sorter: true,
      hideInForm: true,
      renderText: (val: string[]) => val?.join(', '),
    },
    {
      title: 'status',
      dataIndex: 'status',
      // hideInForm: true,
      valueEnum: {
        0: {
          text: 'offline',
          status: 'Default',
          color: 'primary',
        },
        1: {
          text: 'Waiting',
          status: 'Processing',
          color: 'orange',
        },
        2: {
          text: 'Online',
          status: 'Success',
          color: 'orange',
        },
        3: {
          text: 'Do not Disturb',
          status: 'Error',
        },
      },
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Edit
        </a>,
        <a
          key="subscribeAlert"
          onClick={() => {
            setShowDetail(true);
            setCurrentRow(record);
          }}
        >
          Chi tiết
        </a>,
      ],
    },
  ];

  const {
    data,
    error,
    loading,
    run: refetchListUser,
  } = useRequest(
    (isBroker?: boolean) => getListUserBroker({ role: isBroker ? 'Manager' : 'user' }),
    {
      // onSuccess: (res, params) => console.log('onSuccess', res, params),
      formatResult: (res) => res,
    },
  );
  const listUser = data?.users;
  console.log('listUser', listUser);

  const uploadButton = (
    <div>
      {loadingAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoadingAvatar(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(
        info.file.originFileObj,
        (imageUrl: string) => {
          setLoadingAvatar(false);
          setAvatarUrl(imageUrl);
        },
        // this.setState({
        //   imageUrl,
        //   loading: false,
        // }),
      );
    }
  };

  return (
    <PageContainer>
      <ProTable<IUser, TableListPagination>
        headerTitle="List User"
        // actionRef={actionRef}
        rowKey="_id"
        options={{
          reload: false,
          setting: false,
          // search: true
        }}
        search={false}
        scroll={{ x: 600 }}
        toolBarRender={() => [
          <Checkbox
            defaultChecked={onlyBroker}
            key="Direct"
            onChange={(val) => {
              refetchListUser(val.target.checked);
              setOnlyBroker(val.target.checked);
            }}
          >
            Only Broker
          </Checkbox>,
        ]}
        dataSource={listUser}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              chosen{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              item &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
            }}
          >
            Action
          </Button>
          <Button type="primary">Approve</Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        <Descriptions bordered column={1} title="Thông tin user" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="Chỉnh sửa">
            <EditFilled
              size={48}
              onClick={() => {
                setShowDetail(false);
                handleModalVisible(true);
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Avatar">
            <Avatar size="large" src={`https://chat.altisss.vn/avatar/${currentRow?.username}`} />
          </Descriptions.Item>
          <Descriptions.Item label="Username">
            <Paragraph>{currentRow?.name}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Nick name">
            <Paragraph>{currentRow?.nickname}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Tên">
            <Paragraph>{currentRow?.customFields?.account_name}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Email Chat">
            <Paragraph copyable={!!currentRow?.emails?.[0]?.address}>
              {currentRow?.emails?.[0]?.address}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Email Trading">
            <Paragraph>{currentRow?.customFields?.email}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <Paragraph copyable={!!currentRow?.customFields?.phone}>
              {currentRow?.customFields?.phone}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Môi giới">
            <Paragraph copyable={!!currentRow?.customFields?.broker}>
              {currentRow?.customFields?.broker}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Số tài khoản">
            <Paragraph copyable={!!currentRow?.customFields?.account_no}>
              {currentRow?.customFields?.account_no}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Loại tài khoản">
            <Paragraph>{currentRow?.customFields?.account_type_trading}</Paragraph>
          </Descriptions.Item>
        </Descriptions>
        <Divider style={{ marginBottom: 32 }} />
        <Descriptions title="Thông tin thêm" style={{ marginBottom: 32 }} bordered>
          <Descriptions.Item label="Số lượng user quản lý trực tiếp">101</Descriptions.Item>
        </Descriptions>
        <Divider style={{ marginBottom: 32 }} />
        {/* </Card> */}
      </Drawer>
      <ModalForm
        title="Chỉnh sửa User"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          handleModalVisible(false);
          const payload = {
            userId: value.userId,
            data: {
              nickname: value.nickname,
            },
          };
          const updateSuccess = await updateUserInfo(payload, currentRow);
          if (!updateSuccess) {
            message.error('Please try again!');
          } else {
            refetchListUser();
          }
        }}
      >
        <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Avatar size={64} src={`https://chat.altisss.vn/avatar/${currentRow?.username}`} />
        </Row>
        <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
          <Button
            onClick={async () => {
              const updateSuccess = await resetAvatarToDefault({ userId: currentRow?._id || '' });
              if (!updateSuccess) {
                message.error('Please try again!');
              } else {
                refetchListUser();
                setShowDetail(false);
              }
            }}
          >
            Set Default Avatar
          </Button>
        </Row>
        {/* <Avatar size="default" src={`https://chat.altisss.vn/avatar/%40${currentRow?.username}`} /> */}

        <ProFormText
          rules={[
            {
              required: true,
              message: 'userId is required',
            },
          ]}
          width="md"
          initialValue={currentRow?._id}
          name="userId"
          hidden
          label=""
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Nickname is required',
            },
          ]}
          width="md"
          initialValue={currentRow?.nickname}
          name="nickname"
          label="Nickname"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
