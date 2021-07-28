import { Button, Table, Modal } from "antd";
import Searchbar from "./components/Searchbar";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import InventoryForm from "./components/InventoryForm";
import { store } from "../store";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";
import {
    errorHandler,
    formatCurrency,
    NotificationTypes,
    openNotificationWithIcon,
} from "../utils/functions";
import { INVENTORY_URL } from "../utils/myPaths";
import InventoryFormExcel from "./components/InventoryFormExcel";

const columns = [
    {
        title: "Item Code",
        dataIndex: "itemCode",
    },
    {
        title: "Photo",
        dataIndex: "photo",
    },
    {
        title: "Item Name",
        dataIndex: "itemName",
    },
    {
        title: "Item Group",
        dataIndex: "itemGroup",
    },
    {
        title: "Price",
        dataIndex: "price",
    },
    {
        title: "Total",
        dataIndex: "total",
    },
    {
        title: "Remaining",
        dataIndex: "remaining",
    },
    {
        title: "Added on",
        dataIndex: "addedOn",
    },
    {
        title: "Added by",
        dataIndex: "addedBy",
    },
    {
        title: "Actions",
        dataIndex: "actions",
    },
];

export default function Inventory() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inventory, setInventory]: any = useState([]);
    const [fetching, setFetching] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [isSingleAdd, setIsSingleAdd] = useState(true);

    const {
        state: { userToken },
    } = useContext(store);

    const getInventory = async () => {
        setFetching(true);

        const res = await Axios.get(
            INVENTORY_URL + `?page=${currentPage}&keyword=${search}`,
            { headers: { Authorization: userToken } }
        ).catch((e) =>
            openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        );

        if (res) {
            console.log(res.data.results);
            setTotalCount(res.data.count);
            setInventory(
                res.data.results.map((item: any, i: number) => ({
                    key: i,
                    itemCode: item.code,
                    photo: item.photo ? (
                        <img src={item.photo} alt="" height="40" />
                    ) : (
                        "N/A"
                    ),
                    itemName: item.name,
                    itemGroup: item.group.name,
                    price: formatCurrency(item.price),
                    total: item.total,
                    remaining: item.remaining,
                    addedOn: moment(item.created_at).format("DD-MM-YYYY"),
                    addedBy: <Link to="/">{item.added_by.fullname}</Link>,
                    role: item.role,
                    lastLogin: item.last_login,
                    actions: (
                        <div className="flex align-center">
                            <EditOutlined style={{ color: "blue", cursor: "pointer" }} />
                            <div className="spacer-10"></div>
                            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                        </div>
                    ),
                }))
            );
        }

        setFetching(false);
    };

    useEffect(() => {
        getInventory();
    }, [currentPage, search]);

    const showModal = (isSingleMode: boolean) => {
        setIsSingleAdd(isSingleMode);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        getInventory();
    };

    return (
        <>
            <div className="cardMain">
                <div className="headerContent">
                    <h3>Inventory Management</h3>
                    <div className="flex align-center">
                        <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
                        <div className="spacer-10" />
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "rgba(24,144,255,19%)",
                                color: "#1890FF",
                                borderColor: "transparent",
                            }}
                            onClick={() => showModal(true)}
                        >
                            Add Item
                        </Button>
                        <div className="spacer-10" />
                        <Button type="primary" onClick={() => showModal(false)}>
                            Add Item (Excel)
                        </Button>
                    </div>
                </div>

                <Table
                    dataSource={inventory}
                    columns={columns}
                    loading={fetching}
                    pagination={{
                        total: totalCount,
                        pageSize: 20,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            </div>
            <Modal
                title={isSingleAdd ? "Add item" : "Import your items"}
                visible={isModalVisible}
                onCancel={closeModal}
                footer={false}
            >
                {isSingleAdd ? (
                    <InventoryForm onAddComplete={closeModal} />
                ) : (
                    <InventoryFormExcel onAddComplete={closeModal} />
                )}
            </Modal>
        </>
    );
}
