import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Avatar, Drawer, Checkbox } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule, getListUserBroker } from './service';
import type { TableListAccountItem, TableListPagination } from './data';
import { useRequest, request } from 'umi';
import { domain, config } from '@/services/api/axios';
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
      renderText: (val: []) => {
        return String(val[0]?.verified);
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
        return val?.brokerId;
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
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Configure
        </a>,
        <a key="subscribeAlert" onClick={undefined}>
          Delete
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
      <ModalForm
        title="New rules"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as TableListAccountItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Rule name is required',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListAccountItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListAccountItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
