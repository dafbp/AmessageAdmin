import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Avatar, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type { TableListAccountItem, TableListPagination } from './data';
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
  /** International allocation */

  const columns: ProColumns<TableListAccountItem>[] = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (src) => <Avatar size="small" src={src} />,
    },
    {
      title: 'username',
      dataIndex: 'username',
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
      title: 'FosId',
      dataIndex: 'FosId',
      valueType: 'textarea',
    },
    {
      title: '',
      dataIndex: '',
      valueType: 'textarea',
    },
    {
      title: 'broker',
      dataIndex: 'broker',
      valueType: 'textarea',
    },
    {
      title: 'role',
      dataIndex: 'role',
      sorter: true,
      hideInForm: true,
      renderText: (val: string[]) => val.join(', '),
    },
    {
      title: 'status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'offline',
          status: 'Default',
        },
        1: {
          text: 'Waiting',
          status: 'Processing',
        },
        2: {
          text: 'Online',
          status: 'Success',
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

  return (
    <PageContainer>
      <ProTable<TableListAccountItem, TableListPagination>
        headerTitle="Query form"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> New construction
          </Button>,
        ]}
        request={rule}
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
              项 &nbsp;&nbsp;
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
