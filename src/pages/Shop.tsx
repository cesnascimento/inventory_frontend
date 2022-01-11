import { Button, Table, Modal, Popconfirm } from "antd";
import Searchbar from "./components/Searchbar";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import ShopForm from "./components/shopForm";
import Axios from "axios";
import { store } from "../store";
import { SHOP_URL } from "../utils/myPaths";
import {
  errorHandler,
  formatCurrency,
  getAppShops,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import moment from "moment";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
  },
  {
    title: "Created On",
    dataIndex: "createdOn",
  },
  {
    title: "Total Sales (Price)",
    dataIndex: "totalSalePrice",
  },
  {
    title: "Total Sales (Count)",
    dataIndex: "totalSaleCount",
  },
  {
    title: "Actions",
    dataIndex: "actions",
  },
];

export default function Shop() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shops, setShops]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const {
    state: { userToken },
  } = useContext(store);
  const [activeItem, setActiveItem]: any = useState();

  const editItem = (item: any) => {
    setActiveItem(item);
    setIsModalVisible(true);
  };

  const onDelete = async (id: any) => {
    setFetching(true);
    const res: any = Axios.delete(SHOP_URL + `/${id}`, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
      setFetching(false);
    });
    if (res) {
      setTimeout(async () => {
        await getShop();
        openNotificationWithIcon(
          NotificationTypes.SUCCESS,
          "Deletion successful!"
        );
      }, 1000);
    }
  };

  const getShop = async () => {
    setFetching(true);

    const res = await getAppShops(userToken, currentPage, search);

    if (res) {
      setTotalCount(res.data.count);
      setShops(
        res.data.results.map((item: any, i: number) => ({
          key: i,
          name: item.name,
          createdBy: <Link to="/">{item.created_by?.fullname}</Link>,
          createdOn: moment(item.created_at).format("DD-MM-YYYY"),
          totalSalePrice: formatCurrency(parseFloat(item.amount_total) || 0),
          totalSaleCount: item.count_total || 0,
          actions: (
            <div className="flex align-center">
              <EditOutlined
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => editItem(item)}
              />
              <div className="spacer-10"></div>
              <Popconfirm
                title="Are you sure to delete shop?"
                onConfirm={() => onDelete(item.id)}
              >
                <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </div>
          ),
        }))
      );
    }

    setFetching(false);
  };

  useEffect(() => {
    getShop();
  }, [currentPage, search]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    getShop();
  };

  return (
    <>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Shops</h3>
          <div className="flex align-center">
            <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
            <div className="spacer-10" />
            <Button type="primary" onClick={showModal}>
              Add Shop
            </Button>
          </div>
        </div>

        <Table
          dataSource={shops}
          columns={columns}
          loading={fetching}
          pagination={{
            total: totalCount,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
      <Modal
        title="Add User"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={false}
      >
        <ShopForm onAddComplete={closeModal} activeItem={activeItem} />
      </Modal>
    </>
  );
}
