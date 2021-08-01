import { Button } from "antd";
import React, { useState, useRef } from "react";
import {
  errorHandler,
  formatCurrency,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import Inventory from "./Inventory";
import { CloseOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useContext } from "react";
import { store } from "../store";
import Modal from "antd/lib/modal/Modal";
import ShopFormSelect from "./components/shopFormSelect";
import Axios from "axios";
import { INVOICE_URL } from "../utils/myPaths";
import InvoiceCard from "./components/InvoiceCard";

const columns: any = [
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
  {
    title: "",
    dataIndex: "actions",
  },
];

const NewInvoice: React.FC = () => {
  const [itemList, setItemList]: any = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    state: { userToken, shop },
  } = useContext(store);

  const receiptRef: any = useRef();

  const onAddItem = (newItem: any) => {
    const existingItem = itemList
      ? itemList.filter((item: any) => item.id === newItem.id)[0]
      : null;

    if (existingItem) {
      const newQuantity = existingItem.qty + 1;
      if (newQuantity > newItem.remaining) {
        openNotificationWithIcon(
          NotificationTypes.ERROR,
          "You do not have enough item"
        );
        return;
      }
      const index = itemList.indexOf(existingItem);
      itemList[index]["qty"] = newQuantity;
      itemList[index]["total"] = formatCurrency(
        newQuantity * existingItem.mainPrice
      );
      setItemList([...itemList]);
    } else {
      const newData = itemList;
      newData.push({
        key: itemList.length,
        id: newItem.id,
        qty: 1,
        item: newItem.name,
        mainPrice: newItem.price,
        price: formatCurrency(newItem.price),
        total: formatCurrency(newItem.price),
        actions: <CloseOutlined onClick={() => onRemove(newItem.id)} />,
      });
      setItemList([...newData]);
    }
  };

  const onRemove = (id: any) => {
    const existingItem = itemList.filter((item: any) => item.id === id)[0];
    if (existingItem.qty > 1) {
      const newQuantity = existingItem.qty - 1;
      const index = itemList.indexOf(existingItem);
      const newData = itemList;
      newData[index]["qty"] = newQuantity;
      newData[index]["total"] = formatCurrency(
        newQuantity * existingItem.mainPrice
      );
      setItemList([...newData]);
    } else {
      const newData = itemList;
      const index = newData.indexOf(existingItem);
      newData.splice(index, 1);
      setItemList([...newData]);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const checkShopState = () => {
    if (itemList.length < 1) {
      openNotificationWithIcon(
        NotificationTypes.ERROR,
        "You need to add at least one item to invoice"
      );
      return;
    }
    if (shop) {
      handleSubmit(shop);
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = async (shop: any) => {
    setLoading(true);
    setShowModal(false);
    const data = {
      invoice_items_data: itemList.map((item: any) => ({
        item_id: item.id,
        quantity: item.qty,
      })),
      shop_id: shop.id,
    };
    const res = await Axios.post(INVOICE_URL, data, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
      setLoading(false);
    });
    if (res) {
      setLoading(false);
      openNotificationWithIcon(
        NotificationTypes.SUCCESS,
        "Invoice saved successfully"
      );
      if (handlePrint) {
        handlePrint();
      }
      setTimeout(() => setItemList([]), 2000);
    }
  };

  return (
    <div className="newInvoice">
      <div className="inventorySection">
        <Inventory invoiceSection={true} onAddItem={onAddItem} />
      </div>
      <div className="invoiceSection">
        <InvoiceCard
          receiptRef={receiptRef}
          itemList={itemList}
          columns={columns}
        />
        <br />
        <div className="flex align-center">
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            onClick={checkShopState}
          >
            {"Print & Save"}
          </Button>
          <div className="spacer-10"></div>
          <Button type="primary" onClick={() => setItemList([])} danger>
            Clear
          </Button>
        </div>
      </div>
      <Modal
        title={"Select which shop you're selling from"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <ShopFormSelect
          onAddComplete={({ shop }) => {
            handleSubmit(JSON.parse(shop));
          }}
        />
      </Modal>
    </div>
  );
};

export default NewInvoice;
