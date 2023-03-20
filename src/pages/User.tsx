import { Button, Table, Modal, Popconfirm } from 'antd'
import Searchbar from './components/Searchbar'
import { DeleteOutlined } from "@ant-design/icons"
import { useContext, useEffect, useState } from 'react';
import UserForm from './components/userForm';
import Axios from 'axios'
import { USERS_URL } from '../utils/myPaths';
import { store } from '../store';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../utils/functions';
import moment from 'moment';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Role',
        dataIndex: 'role',
    },
    {
        title: 'Added On',
        dataIndex: 'addedOn',
    },
    {
        title: 'Last Login',
        dataIndex: 'lastLogin',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
    },

];

export default function User() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers]: any = useState([])
    const [fetching, setFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [search, setSearch] = useState("")
    const { state: { userToken } } = useContext(store)

    const onDelete = async (id: any) => {
        setFetching(true)
        const res: any = Axios.delete(USERS_URL + `/${id}`, { headers: { Authorization: userToken } }
        ).catch((e) => {
            openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
            setFetching(false)
        }
        );
        if (res) {
            setTimeout(async () => {
                await getUsers()
                openNotificationWithIcon(NotificationTypes.SUCCESS, "Deletion successful!")
            }, 1000)
        }
    }

    const getUsers = async () => {

        setFetching(true)

        const res = await Axios.get(USERS_URL + `?page=${currentPage}&keyword=${search}`,
            { headers: { Authorization: userToken } }).catch(
                e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
            )

        if (res) {
            setTotalCount(res.data.count)
            setUsers(res.data.results.map((item: any, i: number) => ({
                key: i,
                name: item.fullname,
                role: item.role,
                addedOn: moment(item.created_at).format("DD-MM-YYYY"),
                lastLogin: moment(item.last_login).fromNow(),
                actions: <div className="flex align-center">
                    <Popconfirm
                        title="Are you sure to delete user?"
                        onConfirm={() => onDelete(item.id)}
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                    </Popconfirm>
                </div>,
            })))
        }

        setFetching(false)
    }

    useEffect(() => {
        getUsers()
    }, [currentPage, search])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const closeModal = () => {
        setIsModalVisible(false)
        getUsers()
    }

    return (
        <>
            <div className="cardMain">
                <div className="headerContent">
                    <h3>Usuários</h3>
                    <div className="flex align-center">
                        <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
                        <div className="spacer-10" />
                        <Button type="primary" onClick={showModal}>Add User</Button>
                    </div>
                </div>

                <Table
                    dataSource={users}
                    columns={columns}
                    loading={fetching}
                    pagination={{
                        total: totalCount,
                        onChange: (page) => setCurrentPage(page)
                    }}
                />
            </div>
            <Modal title="Add User" visible={isModalVisible} onCancel={closeModal} footer={false}>
                <UserForm onAddComplete={closeModal} />
            </Modal>
        </>
    )
}
