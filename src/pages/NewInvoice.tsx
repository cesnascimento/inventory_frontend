import { Button, Input } from "antd";
import React, { useState, useRef, useReducer, useEffect } from "react";
import {
  errorHandler,
  formatCurrency,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import Inventory from "./Inventory";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useContext } from "react";
import { store } from "../store";
import Modal from "antd/lib/modal/Modal";
import ShopFormSelect from "./components/shopFormSelect";
import Axios from "axios";
import { INVOICE_URL } from "../utils/myPaths";
import InvoiceCard, { InvoiceCardV2 } from "./components/InvoiceCard";

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
    title: "Remove",
    dataIndex: "actions",
  },
];

const NewInvoice: React.FC = () => {
  let [itemList, setItemList]: any = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeInvoice, setActiveInvoice]: any = useState(null);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    state: { userToken, shop },
  } = useContext(store);

  const receiptRef: any = useRef();

  const onAddItem = (newItem: any, qty = 1) => {
    setItemList((prv: any) => {
      const existingItem = prv
        ? prv.filter((item: any) => item.id === newItem.id)[0]
        : null;

      if (existingItem) {
        
        const newQuantity = existingItem.qty + qty;
        if (newQuantity > newItem.remaining) {
          openNotificationWithIcon(
            NotificationTypes.ERROR,
            "You do not have enough item"
          );
          return [...prv];
        }
        const index = prv.indexOf(existingItem);
        prv[index]["qty"] = newQuantity;
        prv[index]["total"] = formatCurrency(
          newQuantity * existingItem.mainPrice
        );
        prv[index]["actions"] = formAction(newItem.id, onRemove, newQuantity);
        setItemList([...prv]);
      } else {
        const newData = prv;
        newData.push({
          key: prv.length,
          id: newItem.id,
          qty,
          item: newItem.name,
          mainPrice: newItem.price,
          price: formatCurrency(newItem.price),
          total: formatCurrency(newItem.price),
          actions: formAction(newItem.id, onRemove, qty),
        });
        setItemList([...newData]);
      }
    });
  };

  const onRemove = (id: any, qty: number) => {
    setItemList((prv: any) => {
      const existingItem = prv.filter((item: any) => item.id === id)[0];
      if (existingItem && existingItem.qty > qty) {
        const newQuantity = existingItem.qty - qty;
        const index = prv.indexOf(existingItem);
        const newData = prv;
        newData[index]["qty"] = newQuantity;
        newData[index]["total"] = formatCurrency(
          newQuantity * existingItem.mainPrice
        );
        prv[index]["actions"] = formAction(
          existingItem.id,
          onRemove,
          newQuantity
        );
        setItemList([...newData]);
      } else {
        const newData = prv;
        const index = newData.indexOf(existingItem);
        newData.splice(index, 1);
        setItemList([...newData]);
      }
    });
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const formAction = (
    itemId: any,
    handler: any,
    qty: number,
    isSuccessButton = false
  ) => {
    return (
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          const count = e.target.elements["count"].value;

          handler(itemId, parseInt(count));
        }}
        className="flex align-center"
      >
        <Input
          type="number"
          name="count"
          max={qty}
          min={1}
          style={{ width: "40px", padding: "2px" }}
          defaultValue={1}
        />
        <Button
          danger={!isSuccessButton}
          style={
            isSuccessButton
              ? {
                  backgroundColor: "rgba(140,255,179,29%)",
                  borderColor: "rgba(140,255,179,29%)",
                  color: "#269962",
                }
              : { padding: "2px" }
          }
          htmlType="submit"
        >
          {isSuccessButton ? (
            <div className="flex align-center">
              <PlusOutlined />
              <div className="spacer-5"></div>
              Add
            </div>
          ) : (
            <CloseOutlined />
          )}
        </Button>
      </form>
    );
  };

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
      setActiveInvoice(res.data);
      openNotificationWithIcon(
        NotificationTypes.SUCCESS,
        "Invoice saved successfully"
      );
      if (handlePrint) {
        handlePrint();
      }
      clearItem();
      setActiveInvoice(null);
    }
  };

  const clearItem = () => {
    setItemList((prv: any) => {
      prv.splice(0, prv.length);
      return [...prv];
    });
  };

  return (
    <div className="newInvoice">
      <div className="inventorySection">
        <Inventory
          invoiceSection={true}
          formAction={(item: any, maxQuantity: any) => {
            return maxQuantity < 1
              ? null
              : formAction(item, onAddItem, maxQuantity, true);
          }}
        />
      </div>
      <div className="invoiceSection">
        {activeInvoice ? (
          <InvoiceCardV2
            receiptRef={receiptRef}
            itemList={
              activeInvoice?.invoice_items.map((item: any) => ({
                item: item.item_name,
                qty: item.quantity,
                price: formatCurrency(item.item.price),
                total: formatCurrency(item.item.price * item.quantity),
                mainPrice: item.amount,
              })) || itemList
            }
            columns={[...columns].slice(0, -1)}
            invoice={activeInvoice?.id || 0}
            printedBy={activeInvoice?.created_by.fullname || ""}
          />
        ) : (
          <InvoiceCard columns={columns} itemList={itemList} />
        )}

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
          <Button type="primary" onClick={clearItem} danger>
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
