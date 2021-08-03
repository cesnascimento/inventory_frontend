import { Button, Table, Modal, Popconfirm } from "antd";
import Searchbar from "./components/Searchbar";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import GroupForm from "./components/groupForm";
import moment from "moment";
import {
  errorHandler,
  formatCurrency,
  getAppGroups,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import { ActionTypes, store } from "../store";
import { Link } from "react-router-dom";
import Axios from "axios";
import { GROUP_URL, INVOICE_URL } from "../utils/myPaths";
import InvoiceCard, { InvoiceCardV2 } from "./components/InvoiceCard";
import ReactToPrint from "react-to-print";
import { useRef } from "react";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Shop",
    dataIndex: "shop",
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
  },
  {
    title: "Total Items",
    dataIndex: "totalItems",
  },
  {
    title: "Created On",
    dataIndex: "createdOn",
  },
  {
    title: "Actions",
    dataIndex: "actions",
  },
];

export default function Invoice() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groups, setGroups]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const {
    state: { userToken },
  } = useContext(store);
  const [activeItem, setActiveItem]: any = useState();

  const receiptRef: any = useRef();

  const getInvoices = async () => {
    setFetching(true);

    const res = await Axios.get(INVOICE_URL, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
    });

    if (res) {
      setTotalCount(res.data.count);
      setGroups(
        res.data.results.map((item: any, i: number) => ({
          key: i,
          id: item.id,
          shop: item?.shop?.name,
          createdBy: <Link to="/">{item?.created_by?.fullname}</Link>,
          totalItems: item?.invoice_items?.length,
          createdOn: moment(item.created_at).format("DD-MM-YYYY"),
          actions: (
            <Button
              onClick={() => {
                setActiveItem(item);
                showModal();
              }}
            >
              View Invoice
            </Button>
          ),
        }))
      );
    }

    setFetching(false);
  };

  useEffect(() => {
    getInvoices();
  }, [currentPage, search]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Invoices</h3>
          <div className="flex align-center">
            <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
          </div>
        </div>

        <Table
          dataSource={groups}
          columns={columns}
          loading={fetching}
          pagination={{
            total: totalCount,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
      <Modal visible={isModalVisible} onCancel={closeModal} footer={false}>
        <InvoiceCardV2
          itemList={activeItem?.invoice_items.map((item: any, i: number) => ({
            key: i,
            id: item.item.id,
            qty: item.quantity,
            mainPrice: item.item.price,
            item: item.item.name,
            price: formatCurrency(item.item.price),
            total: formatCurrency(item.item.price),
          }))}
          receiptRef={receiptRef}
          invoice={activeItem?.id}
          columns={[
            {
              title: "Item",
              dataIndex: "item",
            },
            {
              title: "Qty",
              dataIndex: "qty",
            },
            {
              title: "Price",
              dataIndex: "price",
            },
            {
              title: "Total",
              dataIndex: "total",
            },
          ]}
        />
        <br />
        <ReactToPrint
          trigger={() => <Button>Print</Button>}
          content={() => receiptRef.current}
        />
      </Modal>
    </>
  );
}
