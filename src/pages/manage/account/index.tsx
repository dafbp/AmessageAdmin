import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Avatar, Button, Card, Checkbox, Descriptions, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useRequest } from 'umi';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListAccountItem, TableListPagination } from './data';
import { addRule, getListUserBroker, removeRule, updateRule } from './service';
import { EditFilled } from '@ant-design/icons';

/**
 * Add node
 *
 * @param fields
 */

const handleAdd = async (fields: TableListAccountItem) => {
  const hide = message.loading('Add');

  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Please try again!');
    return false;
  }
};
/**
 * Update node
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListAccountItem) => {
  const hide = message.loading('Be configured');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('Configure success');
    return true;
  } catch (error) {
    hide();
    message.error('If you fail, please try again!');
    return false;
  }
};
/**
 * Delete node
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListAccountItem[]) => {
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

const TableList: React.FC = () => {
  /** New window population */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** Distributed update window pop-up window */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListAccountItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListAccountItem[]>([]);
  const [onlyBroker, setOnlyBroker] = useState(false);
  /** International allocation */

  const columns: ProColumns<TableListAccountItem>[] = [
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
      renderText: (val: []) => {
        return val[0]?.address;
      },
    },
    {
      title: 'verify',
      dataIndex: 'emails',
      render: (val = [], entity) => {
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
      renderText: (val: string[]) => {
        return val?.broker;
      },
    },
    {
      title: 'phone',
      dataIndex: 'customFields',
      // valueType: 'textarea',
      renderText: (val: string[]) => {
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
    run: refetchList,
  } = useRequest((isBroker) => getListUserBroker({ role: isBroker ? 'Manager' : 'user' }), {
    // onSuccess: (res, params) => console.log('onSuccess', res, params),
    formatResult: (res) => res,
  });
  const listUser = data?.users;
  console.log('listUser', listUser);

  return (
    <PageContainer>
      <ProTable<TableListAccountItem, TableListPagination>
        headerTitle="List User"
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        scroll={{ x: 600 }}
        toolBarRender={() => [
          <Checkbox
            defaultChecked={onlyBroker}
            key="Direct"
            onChange={(val) => {
              refetchList(val.target.checked);
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
              <span>
                Total number of service calls{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            batch deletion
          </Button>
          <Button type="primary">Batch approval</Button>
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
          <Descriptions.Item label="Username">{currentRow?.name}</Descriptions.Item>
          <Descriptions.Item label="Nick name">{currentRow?.nickname}</Descriptions.Item>
          <Descriptions.Item label="Tên">
            {currentRow?.customFields?.account_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email Chat">
            {currentRow?.emails?.[0]?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Email Trading">
            {currentRow?.customFields?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">{currentRow?.customFields?.phone}</Descriptions.Item>
          <Descriptions.Item label="Môi giới">{currentRow?.customFields?.broker}</Descriptions.Item>
          <Descriptions.Item label="Số tài khoản">
            {currentRow?.customFields?.account_no}
          </Descriptions.Item>
          <Descriptions.Item label="Loại tài khoản">
            {currentRow?.customFields?.account_type_trading}
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
          console.log('value', value);

          const success = await handleAdd(value as TableListAccountItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <Avatar size="large" src={`https://chat.altisss.vn/avatar/${currentRow?.username}`} />

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
