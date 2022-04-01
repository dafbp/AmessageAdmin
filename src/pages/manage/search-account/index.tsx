import { API_MANAGE } from '@/services/api/axios'
import type { IUser } from '@/types/user/user'
import { EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { Avatar, Button, Checkbox, Descriptions, Divider, Drawer, message, Row, Typography, Upload, Select, Form } from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import { useRequest } from 'umi'
import type { TableListPagination } from './data'
import { getListUserBroker, getListRoles, searchUser, searchUserAdvanced } from './service'
import { domain, config } from '@/services/api/axios'

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
    const [selectUserInfo, setSelectUserInfo] = useState<IUser>()

    const [formEditUser] = Form.useForm()

    useEffect(() => {
        setCurrentRowUserRolesUpdate(selectUserInfo?.roles || [])
    }, [selectUserInfo])

    useEffect(() => {
        if (currentRow?._id) {
            getUserInfoByIdAsync()
        }
    }, [currentRow])

    const getUserInfoByIdAsync = async () => {
        const { data, success } = await API_MANAGE.getUserInfoById({ userId: currentRow?._id })
        if (success) {
            formEditUser.resetFields()
            setSelectUserInfo(data)
        } else {
            formEditUser.resetFields()
            setSelectUserInfo(undefined)
        }
    }

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
            title: 'username',
            dataIndex: 'username',
            hideInTable: true,
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
        data: dataUserSearch,
        error: errorSearch,
        loading: loadingUserSearch,
        run: refetchListUserSearch,
    } = useRequest(
        ({ searchString }: { searchString: string }) =>
            searchUserAdvanced({
                isSearchBroker: true,
                isSearchPhone: true,
                isSearchName: true,
                searchString,
            }),
        {
            formatResult: (res) => res,
        },
    )
    const listUserSearch = dataUserSearch?.users || []
    console.log('dataUserSearch', dataUserSearch)
    // -----------
    const {
        data: dataRoles,
        loading: loadingGetRoles,
        run: refetchListRoles,
    } = useRequest(getListRoles, {
        formatResult: (res) => res,
    })
    const listRoles = dataRoles?.roles || []

    return (
        <PageContainer>
            <ProTable<IUser, TableListPagination>
                headerTitle='Tìm kiếm user theo broker, số điện thoại'
                actionRef={actionRef}
                rowKey='_id'
                loading={loadingUserSearch}
                options={{
                    reload: false,
                    setting: false,
                }}
                search={false}
                scroll={{ x: 600 }}
                toolBarRender={() => []}
                toolbar={{
                    search: {
                        placeholder: 'Tìm kiếm user theo broker, số điện thoại',
                        title: 'Tìm kiếm user theo broker, số điện thoại',
                        onSearch: (value) => {
                            refetchListUserSearch({ searchString: value })
                        },
                    },
                }}
                dataSource={listUserSearch}
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
                        <Avatar size='large' src={`https://chat.altisss.vn/avatar/${selectUserInfo?.username}`} />
                    </Descriptions.Item>
                    <Descriptions.Item label='Username'>
                        <Paragraph>{selectUserInfo?.name}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Nick name'>
                        <Paragraph>{selectUserInfo?.nickname}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Tên'>
                        <Paragraph>{selectUserInfo?.customFields?.account_name}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Quyền'>
                        <Select
                            mode='multiple'
                            style={{ width: '100%' }}
                            placeholder='Selected roles'
                            disabled
                            value={selectUserInfo?.roles || []}
                            optionLabelProp='label'
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label='Email Chat'>
                        <Paragraph copyable={!!selectUserInfo?.emails?.[0]?.address}>{selectUserInfo?.emails?.[0]?.address}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Email Trading'>
                        <Paragraph>{selectUserInfo?.customFields?.email}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone'>
                        <Paragraph copyable={!!selectUserInfo?.customFields?.phone}>{selectUserInfo?.customFields?.phone}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Môi giới'>
                        <Paragraph copyable={!!selectUserInfo?.customFields?.broker}>{selectUserInfo?.customFields?.broker}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Số tài khoản'>
                        <Paragraph copyable={!!selectUserInfo?.customFields?.account_no}>{selectUserInfo?.customFields?.account_no}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label='Loại tài khoản'>
                        <Paragraph>{selectUserInfo?.customFields?.account_type_trading}</Paragraph>
                    </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 32 }} />
                <Descriptions title='Thông tin thêm' style={{ marginBottom: 32 }} bordered>
                    <Descriptions.Item label='Số lượng user quản lý trực tiếp'>101</Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 32 }} />
                {/* </Card> */}
            </Drawer>
            <ModalForm
                title='Chỉnh sửa User'
                width='400px'
                form={formEditUser}
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
                    const updateSuccess = await updateUserInfo(payload, selectUserInfo)
                    if (!updateSuccess) {
                        message.error('Please try again!')
                    } else {
                        // refetchListUser()
                    }
                }}
            >
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar size={64} src={`https://chat.altisss.vn/avatar/${selectUserInfo?.username}`} />
                </Row>
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Button
                        onClick={async () => {
                            const updateSuccess = await resetAvatarToDefault({ userId: selectUserInfo?._id || '' })
                            if (!updateSuccess) {
                                message.error('Please try again!')
                            } else {
                                // refetchListUser()
                                setShowDetail(false)
                            }
                        }}
                    >
                        Set Default Avatar
                    </Button>
                </Row>

                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: 'userId is required',
                        },
                    ]}
                    width='md'
                    initialValue={selectUserInfo?._id}
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
                    initialValue={selectUserInfo?.nickname}
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
