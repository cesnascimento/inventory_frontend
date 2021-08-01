import { Table } from "antd";
import moment from "moment";
import React from "react";
import { formatCurrency } from "../../utils/functions";

export default function InvoiceCard({
  receiptRef,
  itemList,
  columns,
  createdAt,
}: {
  receiptRef?: any;
  itemList: any;
  columns: any;
  createdAt?: any;
}) {
  const total = itemList.reduce((acc: number, item: any) => {
    acc += item.qty * item.mainPrice;
    return acc;
  }, 0);

  return (
    <div className="cardMain" ref={receiptRef}>
      <Table dataSource={itemList} columns={columns} pagination={false} />
      <br />
      <div className="headerContent">
        <div>
          <div>
            <div className="info">Date:</div>
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
              {moment(createdAt ? new Date(createdAt) : new Date()).format(
                "DD/MM/YYYY"
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="info">Total:</div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {formatCurrency(total)}
          </div>
        </div>
      </div>
    </div>
  );
}
