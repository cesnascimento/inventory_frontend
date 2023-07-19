import { Button, Table, Modal, Popconfirm } from 'antd'
import Searchbar from './components/Searchbar'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useContext, useEffect, useState } from 'react';
import GroupForm from './components/groupForm';
import moment from 'moment';
import { errorHandler, getAppGroups, NotificationTypes, openNotificationWithIcon } from '../utils/functions';
import { ActionTypes, store } from '../store';
import { Link } from 'react-router-dom';
import Axios from "axios";
import { GROUP_URL } from '../utils/myPaths';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Local',
        dataIndex: 'name',
    },
    /* {
        title: 'Belongs To (Another Group)',
        dataIndex: 'belongsTo',
    }, */
    {
        title: 'Criado por',
        dataIndex: 'createdBy',
    },
    {
        title: 'Equipamentos',
        dataIndex: 'totalItems',
    },
    {
        title: 'Criado em',
        dataIndex: 'createdOn',
    },
    {
        title: 'Ações',
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
    const [activeItem, setActiveItem]: any = useState();

    const editItem = (item: any) => {
        setActiveItem(item);
        setIsModalVisible(true);
    };

    const onDelete = async (id: any) => {
        setFetching(true)
        const res: any = Axios.delete(GROUP_URL + `/${id}`, { headers: { Authorization: userToken } }
        ).catch((e) => {
            openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
            setFetching(false)
        }
        );
        if (res) {
            setTimeout(async () => {
                await getGroups()
                openNotificationWithIcon(NotificationTypes.SUCCESS, "Deletion successful!")
            }, 1000)
        }
    }

    const getGroups = async () => {

        setFetching(true)

        const res = await getAppGroups(userToken, currentPage, search)

        if (res) {
            console.log('AQUI É O RES DO GROUP', res.data.results, res.data.count)
            setGroupData(res.data.results)
            setTotalCount(res.data.count)
            setGroups(res.data.results.map((item: any, i: number) => ({
                key: i,
                id: item.id,
                name: item.name,
                belongsTo: item.belongs_to?.name || "Null",
                createdBy: <Link to="/">{item.created_by?.fullname}</Link>,
                totalItems: item.total_items || 0,
                createdOn: moment(item.created_at).format("DD-MM-YYYY"),
                actions: <div className="flex align-center">
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => editItem(item)}
                    />
                    <div className="spacer-10"></div>
                    <Popconfirm
                        title="Are you sure to delete group?"
                        onConfirm={() => onDelete(item.id)}
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                    </Popconfirm>
                </div>,
            })))
            dispatch({ type: ActionTypes.UPDATE_APP_GROUP, payload: res.data.results })
        }

        setFetching(false)
    }

    useEffect(() => {
        getGroups()
    }, [currentPage, search])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const closeModal = () => {
        setIsModalVisible(false)
        getGroups()
    }

    console.log('AQUI É O GROUPS 2', groups)

    return (
        <>
            <div className="cardMain">
                <div className="headerContent">
                    <h3>Local</h3>
                    <div className="flex align-center">
                        <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
                        <div className="spacer-10" />
                        <Button type="primary" onClick={showModal}>Add Local</Button>
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
            <Modal title="Add Local" visible={isModalVisible} onCancel={closeModal} footer={false}>
                <GroupForm onAddComplete={closeModal} belongsToList={groupData} activeItem={activeItem} />
            </Modal>
        </>
    )
}
