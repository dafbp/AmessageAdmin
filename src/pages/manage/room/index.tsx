import { EditFilled } from '@ant-design/icons'
import ProForm, { ModalForm, ProFormText, ProFormTextArea, ProFormSwitch } from '@ant-design/pro-form'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { Avatar, Button, Checkbox, Descriptions, Divider, Drawer, message, Row, Switch, Tooltip, Form } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { API_MANAGE } from '../../../services/api/axios'
import type { TableListPagination } from './data'
import type { IRoomInfo } from '@/types/room/room'
import { FormattedMessage } from 'umi'

const updateRoomInfo = async (body: API.UpdateRoomInfo, currentRow?: IRoomInfo) => {
    const hide = message.loading('Đang chỉnh sửa user')
    try {
        await API_MANAGE.updateRoomInfo(body)
        hide()
        message.success('Chỉnh sửa thông tin room thành công')
        return true
    } catch (error) {
        hide()
        message.error('If you fail, please try again!')
        return false
    }
}

export const DEFAULT_TYPES = ['p', 'c', 'teams']

const TableList: React.FC = () => {
    /** New window population */
    const [editModalVisible, setModalEditVisible] = useState<boolean>(false)
    /** Distributed update window pop-up window */

    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false)
    const [showDetail, setShowDetail] = useState<boolean>(false)
    const actionRef = useRef<ActionType>()
    const [currentRow, setCurrentRow] = useState<IRoomInfo>()
    const [currentRowDetails, setCurrentRowDetails] = useState<IRoomInfo>()
    const [selectedRowsState, setSelectedRows] = useState<IRoomInfo[]>([])
    /** International allocation */
    const [params, setParams] = useState({
        text: '',
        types: DEFAULT_TYPES,
        current: 0,
        itemsPerPage: 25,
    })

    const [formEditRoom] = Form.useForm()

    const [listRooms, setListRooms] = useState([])

    const getRoomsData = async () => {
        const { data, success } = await API_MANAGE.getAllRoom(params)
        if (success) {
            setListRooms(data)
        } else {
            message.warn('Có lỗi xảy ra')
        }
    }

    useEffect(() => {
        getRoomsData()
    }, [params])

    useEffect(() => {
        if (currentRow?._id) {
            getRoomInfoByIdAsync()
        }
    }, [currentRow])

    const getRoomInfoByIdAsync = async () => {
        const { data, success } = await API_MANAGE.getRoomInfoById({ rid: currentRow?._id })
        if (success) {
            setCurrentRowDetails(data)
        } else {
            setCurrentRowDetails(undefined)
        }
        formEditRoom.resetFields()
    }

    const columns: ProColumns<IRoomInfo>[] = [
        {
            title: '',
            dataIndex: 'avatar',
            render: (src, room) => <Avatar size='small' src={`https://chat.altisss.vn/avatar/room/${room?._id}`} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (dom, room) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(room)
                            setShowDetail(true)
                        }}
                    >
                        {room?.t === 'd' ? room?.usernames?.join(' x ') : dom}
                    </a>
                )
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
                    key='config'
                    onClick={() => {
                        setModalEditVisible(true)
                        setCurrentRow(record)
                        formEditRoom.resetFields()
                    }}
                >
                    Configure
                </a>,
            ],
        },
    ]

    // const searchRooms = (value, type) => {};
    const checkBoxChange = (value: boolean, type: string) => {
        if (value) {
            setParams((prev: any) => ({
                ...prev,
                types: [...prev.types, type],
            }))
        } else {
            setParams((prev: any) => ({
                ...prev,
                types: params.types.filter((t: string) => t !== type),
            }))
        }
    }
    console.log('listRooms', listRooms, currentRow, currentRowDetails)

    return (
        <PageContainer>
            <ProTable<IRoomInfo, TableListPagination>
                headerTitle='List All Room'
                actionRef={actionRef}
                rowKey='_id'
                search={false}
                toolbar={{
                    search: {
                        onSearch: (value) => {
                            setParams((prev: any) => ({
                                ...prev,
                                text: value,
                            }))
                        },
                    },
                    actions: [
                        <Checkbox defaultChecked={params.types.includes('d')} key='Direct' onChange={(val) => checkBoxChange(val.target.checked, 'd')}>
                            Direct
                        </Checkbox>,
                        <Checkbox defaultChecked={params.types.includes('c')} key='Public' onChange={(val) => checkBoxChange(val.target.checked, 'c')}>
                            Public
                        </Checkbox>,
                        <Checkbox defaultChecked={params.types.includes('p')} key='Private' onChange={(val) => checkBoxChange(val.target.checked, 'p')}>
                            Private
                        </Checkbox>,
                        <Checkbox key='Omnichannel' disabled>
                            Omnichannel
                        </Checkbox>,
                        <Checkbox
                            key='Discussions'
                            defaultChecked={params.types.includes('Discussions')}
                            onChange={(val) => checkBoxChange(val.target.checked, 'Discussions')}
                        >
                            Discussions
                        </Checkbox>,
                        <Checkbox defaultChecked={params.types.includes('teams')} key='Teams' onChange={(val) => checkBoxChange(val.target.checked, 'teams')}>
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
                            <span>Total number of service calls {/* {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万 */}</span>
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            // await handleRemove(selectedRowsState)
                            setSelectedRows([])
                            // actionRef.current?.reloadAndRest?.()
                        }}
                    >
                        batch deletion
                    </Button>
                    <Button type='primary'>Batch approval</Button>
                </FooterToolbar>
            )}
            <ModalForm
                title={<FormattedMessage id='pages.Manage.Room.Edit_Room_Info' />}
                width='400px'
                form={formEditRoom}
                visible={currentRowDetails && editModalVisible}
                onVisibleChange={setModalEditVisible}
                onFinish={async (value) => {
                    setModalEditVisible(false)
                    console.log('>>> value', value)
                    const payload = {
                        rid: value.id,
                        roomName: value.fname,
                        roomDescription: value.description,
                        roomAnnouncement: value.announcement,
                        roomTopic: value.topic,
                        roomType: value.roomType ? 'p' : 'c',
                        readOnly: !!value.readOnly,
                    }
                    const updateSuccess = await updateRoomInfo(payload, currentRow)
                    if (!updateSuccess) {
                        message.error('Please try again!')
                    } else {
                        message.success('Update room info success')
                        getRoomsData()
                    }
                }}
            >
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar size={64} src={`https://chat.altisss.vn/avatar/room/${currentRowDetails?._id}`} />
                </Row>
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Button
                        onClick={async () => {
                            // const updateSuccess = await resetAvatarToDefault({ userId: currentRow?._id || '' })
                            // if (!updateSuccess) {
                            //     message.error('Please try again!')
                            // } else {
                            //     refetchListUser()
                            //     setShowDetail(false)
                            // }
                        }}
                    >
                        Set Default Avatar
                    </Button>
                </Row>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: 'Room Id is required',
                        },
                    ]}
                    width='md'
                    initialValue={currentRowDetails?._id}
                    name='rid'
                    hidden
                    label='Room Id'
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: 'Room name is required',
                        },
                    ]}
                    width='md'
                    initialValue={currentRowDetails?.fname}
                    name='fname'
                    label='Room Name'
                />

                <ProFormText width='md' initialValue={currentRowDetails?.description} name='description' label='Desicription' />
                <ProFormTextArea width='md' initialValue={currentRowDetails?.announcement} name='announcement' label='announcement' />
                <ProFormTextArea width='md' initialValue={currentRowDetails?.topic} name='topic' label='topic' />
                <ProFormSwitch
                    initialValue={currentRowDetails?.t === 'p'}
                    label='Private'
                    tooltip={'Just invited people can access this channel.'}
                    name='roomType'
                />
                <ProFormSwitch
                    initialValue={currentRowDetails?.ro}
                    label='Read Only'
                    tooltip={'Only authorized users can write new messages'}
                    name='readOnly'
                />
            </ModalForm>

            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined)
                    setShowDetail(false)
                }}
                closable={false}
            >
                <Descriptions bordered column={1} title='Thông tin room' style={{ marginBottom: 32 }}>
                    <Descriptions.Item label='Chỉnh sửa'>
                        <EditFilled
                            size={48}
                            onClick={() => {
                                setShowDetail(false)
                                setModalEditVisible(true)
                                formEditRoom.resetFields()
                            }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label='Avatar'>
                        <Avatar size='large' src={`https://chat.altisss.vn/avatar/room/${currentRowDetails?._id}`} />
                    </Descriptions.Item>
                    <Descriptions.Item label='Room Name'>{currentRowDetails?.name}</Descriptions.Item>
                    <Descriptions.Item label='Người sở hữu'>{currentRowDetails?.u?.username}</Descriptions.Item>
                    <Descriptions.Item label='Description'>{currentRowDetails?.description}</Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 32 }} />
                <Descriptions column={1} title='Thông tin thêm' style={{ marginBottom: 32 }} bordered>
                    <Descriptions.Item label='Công bố'>{currentRowDetails?.announcement}</Descriptions.Item>
                    <Descriptions.Item label='Topic'>{currentRowDetails?.topic}</Descriptions.Item>
                    <Descriptions.Item label={<Tooltip title={'Just invited people can access this channel.'}>Private</Tooltip>}>
                        <Switch disabled defaultChecked={currentRowDetails?.t === 'p'} />
                    </Descriptions.Item>
                    <Descriptions.Item label={<Tooltip title={'Only authorized users can write new messages'}>Read Only</Tooltip>}>
                        <Switch disabled defaultChecked={currentRowDetails?.ro} />
                    </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 32 }} />
            </Drawer>
        </PageContainer>
    )
}

export default TableList
