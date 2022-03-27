import { Button, message, Input, Drawer, Avatar, Checkbox } from 'antd';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import { API_MANAGE } from '../../../services/api/axios';

/**
 * Add node
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
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

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
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

const handleRemove = async (selectedRows: TableListItem[]) => {
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
export const DEFAULT_TYPES = ['p', 'c', 'd', 'teams'];

const TableList: React.FC = () => {
  /** New window population */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** Distributed update window pop-up window */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** International allocation */
  const [params, setParams] = useState({
    text: '',
    types: DEFAULT_TYPES,
    current: 0,
    itemsPerPage: 25,
  });

  const [listRooms, setListRooms] = useState([]);

  const getRoomsData = async () => {
    const { data, success } = await API_MANAGE.getAllRoom(params);
    if (success) {
      setListRooms(data);
    } else {
      message.warn('Có lỗi xảy ra');
    }
  };

  useEffect(() => {
    getRoomsData();
  }, [params]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (src) => <Avatar size="small" src={src} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (dom, room) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(room);
              setShowDetail(true);
            }}
          >
            {room.t === 'd' ? room.usernames.join(' x ') : dom}
          </a>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 't',
      sorter: true,
      valueEnum: {
        p: {
          text: 'Room',
        },
        d: {
          text: 'Direct',
        },
        teams: {
          text: 'Teams',
        },
        c: {
          text: 'Channel',
        },
      },
    },
    {
      title: 'Users Count',
      dataIndex: 'usersCount',
      hideInForm: true,
      sorter: true,
    },
    {
      title: 'Msgs',
      dataIndex: 'msgs',
      hideInForm: true,
      sorter: true,
    },
    {
      title: 'Default',
      dataIndex: 'default',
      hideInForm: true,
      renderText: (val) => String(val),
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
      ],
    },
  ];

  // const searchRooms = (value, type) => {};
  const checkBoxChange = (value: boolean, type: string) => {
    if (value) {
      setParams((prev: any) => ({
        ...prev,
        types: [...prev.types, type],
      }));
    } else {
      setParams((prev: any) => ({
        ...prev,
        types: params.types.filter((t: string) => t !== type),
      }));
    }
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="List All Room"
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        toolbar={{
          search: {
            onSearch: (value) => {
              setParams((prev: any) => ({
                ...prev,
                text: value,
              }));
            },
          },
          actions: [
            <Checkbox
              defaultChecked={params.types.includes('d')}
              key="Direct"
              onChange={(val) => checkBoxChange(val.target.checked, 'd')}
            >
              Direct
            </Checkbox>,
            <Checkbox
              defaultChecked={params.types.includes('c')}
              key="Public"
              onChange={(val) => checkBoxChange(val.target.checked, 'c')}
            >
              Public
            </Checkbox>,
            <Checkbox
              defaultChecked={params.types.includes('p')}
              key="Private"
              onChange={(val) => checkBoxChange(val.target.checked, 'p')}
            >
              Private
            </Checkbox>,
            <Checkbox key="Omnichannel" disabled>
              Omnichannel
            </Checkbox>,
            <Checkbox
              key="Discussions"
              defaultChecked={params.types.includes('Discussions')}
              onChange={(val) => checkBoxChange(val.target.checked, 'Discussions')}
            >
              Discussions
            </Checkbox>,
            <Checkbox
              defaultChecked={params.types.includes('teams')}
              key="Teams"
              onChange={(val) => checkBoxChange(val.target.checked, 'teams')}
            >
              Teams
            </Checkbox>,
          ],
        }}
        toolBarRender={() => []}
        // request={rule}
        dataSource={listRooms}
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
          const success = await handleAdd(value as TableListItem);
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
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
