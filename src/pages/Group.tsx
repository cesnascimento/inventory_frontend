import { Button, Table, Modal } from 'antd'
import Searchbar from './components/Searchbar'
import { DeleteOutlined } from "@ant-design/icons"
import { useContext, useEffect, useState } from 'react';
import GroupForm from './components/groupForm';
import moment from 'moment';
import { getAppGroups } from '../utils/functions';
import { ActionTypes, store } from '../store';
import { Link } from 'react-router-dom';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Belongs To (Another Group)',
        dataIndex: 'belongsTo',
    },
    {
        title: 'Created By',
        dataIndex: 'createdBy',
    },
    {
        title: 'Total Items',
        dataIndex: 'totalItems',
    },
    {
        title: 'Created On',
        dataIndex: 'createdOn',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
    },

];

export default function Group() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groups, setGroups]: any = useState([])
    const [groupData, setGroupData]: any = useState([])
    const [fetching, setFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [search, setSearch] = useState("")
    const { state: { userToken }, dispatch } = useContext(store)

    const getUsers = async () => {

        setFetching(true)

        const res = await getAppGroups(userToken, currentPage, search)

        if (res) {
            setGroupData(res.data.results)
            setTotalCount(res.data.count)
            setGroups(res.data.results.map((item: any, i: number) => ({
                key: i,
                id: item.id,
                name: item.name,
                belongsTo: item.belongs_to?.name || "Null",
                createdBy: <Link to="/">{item.created_by.fullname}</Link>,
                totalItems: item.total_items || 0,
                createdOn: moment(item.created_at).format("DD-MM-YYYY"),
                actions: <div className="flex align-center">
                    <DeleteOutlined style={{ color: "red" }} />
                </div>,
            })))
            dispatch({ type: ActionTypes.UPDATE_APP_GROUP, payload: res.data.results })
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
                    <h3>Users</h3>
                    <div className="flex align-center">
                        <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
                        <div className="spacer-10" />
                        <Button type="primary" onClick={showModal}>Add Group</Button>
                    </div>
                </div>

                <Table
                    dataSource={groups}
                    columns={columns}
                    loading={fetching}
                    pagination={{
                        total: totalCount,
                        onChange: (page) => setCurrentPage(page)
                    }}
                />
            </div>
            <Modal title="Add User" visible={isModalVisible} onCancel={closeModal} footer={false}>
                <GroupForm onAddComplete={closeModal} belongsToList={groupData} />
            </Modal>
        </>
    )
}
