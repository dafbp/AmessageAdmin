import { API_MANAGE } from '@/services/api/axios'
import type { IUser } from '@/types/user/user'
import { EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { Avatar, Button, Checkbox, Descriptions, Divider, Drawer, message, Row, Typography, Upload, Select } from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import { useRequest } from 'umi'
import type { TableListPagination } from './data'
import { getListUserBroker, getListRoles } from './service'
import { domain, config } from '@/services/api/axios'
import { searchUserAdvanced } from '../search-account/service'

const { Paragraph } = Typography

const updateUserInfo = async (body: API.UpdateUserInfo, currentRow?: IUser) => {
    const hide = message.loading('Đang chỉnh sửa user')
    try {
        await API_MANAGE.updateUserInfo(body)
        hide()
        message.success('Configure success')
        return true
    } catch (error) {
        hide()
        message.error('If you fail, please try again!')
        return false
    }
}
const resetAvatarToDefault = async (body: { userId: string }) => {
    const hide = message.loading('Đang chỉnh sửa')
    try {
        await API_MANAGE.resetAvatarToDefault(body)
        hide()
        message.success('Thay đổi avatar mặc định thành công')
        return true
    } catch (error) {
        hide()
        message.error('Thay đổi avatar mặc định thất bại')
        return false
    }
}
/**
 * Delete node
 *
 * @param selectedRows
 */

const TableList: React.FC = () => {
    /** New window population */
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false)
    const [showDetail, setShowDetail] = useState<boolean>(false)
    const actionRef = useRef<ActionType>()
    const [currentRow, setCurrentRow] = useState<IUser>()
    const [currentRowUserRolesUpdate, setCurrentRowUserRolesUpdate] = useState<IUser['roles']>([])
    const [selectedRowsState, setSelectedRows] = useState<IUser[]>([])
    const [onlyBroker, setOnlyBroker] = useState(true)

    useEffect(() => {
        setCurrentRowUserRolesUpdate(currentRow?.roles || [])
    }, [currentRow?.roles])
    useEffect(() => {
        if (currentRow?.customFields?.account_no && currentRow?.roles?.includes('brokertest')) {
            refetchListUserSearchByBrokerId({ searchString: currentRow?.customFields?.account_no })
        }
    }, [currentRow])

    const columns: ProColumns<IUser>[] = [
        {
            title: '',
            dataIndex: 'avatar',
            render: (src, row) => <Avatar size='small' src={`https://chat.altisss.vn/avatar/${row.username}`} />,
        },
        {
            title: 'name',
            dataIndex: 'name',
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity)
                            setShowDetail(true)
                        }}
                    >
                        {dom}
                    </a>
                )
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
                return val[0]?.address
            },
        },
        {
            title: 'verify',
            dataIndex: 'emails',
            renderText: (val: IUser['emails'], entity) => {
                return <Checkbox defaultChecked={val[0]?.verified} disabled />
            },
        },
        {
            title: 'broker',
            dataIndex: 'customFields',
            renderText: (val: IUser['customFields']) => {
                return val?.broker
            },
        },
        {
            title: 'phone',
            dataIndex: 'customFields',
            // valueType: 'textarea',
            renderText: (val: IUser['customFields']) => {
                return val?.phone
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
                    key='config'
                    onClick={() => {
                        handleUpdateModalVisible(true)
                        setCurrentRow(record)
                    }}
                >
                    Edit
                </a>,
                <a
                    key='subscribeAlert'
                    onClick={() => {
                        setShowDetail(true)
                        setCurrentRow(record)
                    }}
                >
                    Chi tiết
                </a>,
            ],
        },
    ]

    const {
        data,
        error,
        loading,
        run: refetchListUser,
    } = useRequest((isBroker?: boolean) => getListUserBroker({ role: isBroker ? 'brokertest' : 'user' }), {
        formatResult: (res) => res,
    })
    const listUser = data?.users || []

    const {
        data: dataRoles,
        loading: loadingGetRoles,
        run: refetchListRoles,
    } = useRequest(getListRoles, {
        formatResult: (res) => res,
    })
    const listRoles = dataRoles?.roles || []
    console.log('listUser', listUser, dataRoles)

    const {
        data: dataUserSearch,
        error: errorSearch,
        loading: loadingUserSearch,
        run: refetchListUserSearchByBrokerId,
    } = useRequest(
        ({ searchString }: { searchString: string }) =>
            searchUserAdvanced({
                isSearchBroker: true,
                searchString,
            }),
        {
            formatResult: (res) => res,
        },
    )
    const listUserSearchByBrokerId = dataUserSearch?.users || []
    console.log('listUserSearchByBrokerId', listUserSearchByBrokerId)

    return (
        <PageContainer>
            <ProTable<IUser, TableListPagination>
                headerTitle='List User'
                actionRef={actionRef}
                rowKey='_id'
                loading={loading}
                options={{
                    reload: false,
                    setting: false,
                }}
                search={false}
                scroll={{ x: 600 }}
                toolBarRender={() => []}
                toolbar={{
                    actions: [
                        <Checkbox
                            defaultChecked={onlyBroker}
                            key='Direct'
                            onChange={(val) => {
                                refetchListUser(val.target.checked)
                                setOnlyBroker(val.target.checked)
                            }}
                        >
                            Only Broker
                        </Checkbox>,
                    ],
                }}
                dataSource={listUser}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows)
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
                            setSelectedRows([])
                            // actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        Action
                    </Button>
                    <Button type='primary'>Approve</Button>
                </FooterToolbar>
            )}

            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined)
                    setShowDetail(false)
                }}
                closable={false}
            >
                <Descriptions bordered column={1} title='Thông tin user' style={{ marginBottom: 32 }}>
                    <Descriptions.Item label='Chỉnh sửa'>
                        <EditFilled
                            size={48}
                            onClick={() => {
                                setShowDetail(false)
                                handleUpdateModalVisible(true)
                            }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label='Avatar'>
                        <Avatar size='large' src={`https://chat.altisss.vn/avatar/${currentRow?.username}`} />
                    </Descriptions.Item>
                    <Descriptions.Item label='Username'>
                        <Paragraph>{currentRow?.name}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Nick name'>
                        <Paragraph>{currentRow?.nickname}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Tên'>
                        <Paragraph>{currentRow?.customFields?.account_name}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Quyền'>
                        <Select
                            mode='multiple'
                            style={{ width: '100%' }}
                            placeholder='Selected roles'
                            disabled
                            value={currentRow?.roles || []}
                            optionLabelProp='label'
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label='Email Chat'>
                        <Paragraph copyable={!!currentRow?.emails?.[0]?.address}>{currentRow?.emails?.[0]?.address}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Email Trading'>
                        <Paragraph>{currentRow?.customFields?.email}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone'>
                        <Paragraph copyable={!!currentRow?.customFields?.phone}>{currentRow?.customFields?.phone}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Môi giới'>
                        <Paragraph copyable={!!currentRow?.customFields?.broker}>{currentRow?.customFields?.broker}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Số tài khoản'>
                        <Paragraph copyable={!!currentRow?.customFields?.account_no}>{currentRow?.customFields?.account_no}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Loại tài khoản'>
                        <Paragraph>{currentRow?.customFields?.account_type_trading}</Paragraph>
                    </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 32 }} />
                <Descriptions title='Thông tin thêm' style={{ marginBottom: 32 }} bordered>
                    <Descriptions.Item label='Số lượng user quản lý trực tiếp'>{listUserSearchByBrokerId?.length}</Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 32 }} />
                <ProTable<IUser, TableListPagination>
                    headerTitle='Danh sách user trực thuộc'
                    rowKey='_id'
                    loading={loading}
                    options={{
                        reload: false,
                        setting: false,
                    }}
                    search={false}
                    toolBarRender={() => []}
                    toolbar={{
                        actions: [],
                    }}
                    dataSource={listUserSearchByBrokerId}
                    columns={[
                        {
                            title: '',
                            dataIndex: 'avatar',
                            render: (src, row) => <Avatar size='small' src={`https://chat.altisss.vn/avatar/${row.username}`} />,
                        },
                        {
                            title: 'username',
                            dataIndex: 'username',
                        },
                    ]}
                />
            </Drawer>
            <ModalForm
                title='Chỉnh sửa User'
                width='400px'
                visible={updateModalVisible}
                onVisibleChange={handleUpdateModalVisible}
                onFinish={async (value) => {
                    handleUpdateModalVisible(false)
                    const payload = {
                        userId: value.userId,
                        data: {
                            nickname: value.nickname,
                            roles: currentRowUserRolesUpdate,
                        },
                    }
                    const updateSuccess = await updateUserInfo(payload, currentRow)
                    if (!updateSuccess) {
                        message.error('Please try again!')
                    } else {
                        refetchListUser()
                    }
                }}
            >
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar size={64} src={`https://chat.altisss.vn/avatar/${currentRow?.username}`} />
                </Row>
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Button
                        onClick={async () => {
                            const updateSuccess = await resetAvatarToDefault({ userId: currentRow?._id || '' })
                            if (!updateSuccess) {
                                message.error('Please try again!')
                            } else {
                                refetchListUser()
                                setShowDetail(false)
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
                    width='md'
                    initialValue={currentRow?._id}
                    name='userId'
                    hidden
                    label=''
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: 'Nickname is required',
                        },
                    ]}
                    width='md'
                    initialValue={currentRow?.nickname}
                    name='nickname'
                    label='Nickname'
                />
                <Select
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder='Selected roles'
                    loading={loadingGetRoles}
                    value={currentRowUserRolesUpdate || []}
                    onChange={(value) => {
                        setCurrentRowUserRolesUpdate(value)
                    }}
                    optionLabelProp='label'
                >
                    {listRoles.map((item: IRoles) => (
                        <Select.Option key={item._id} value={item._id} label={item.name}>
                            <div className='demo-option-label-item'>
                                {item.name}-{item.description}
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </ModalForm>
        </PageContainer>
    )
}

export default TableList
interface IRoles {
    _id: string
    description: string
    mandatory2fa: boolean
    name: string
    protected: boolean
    scope: string
}
