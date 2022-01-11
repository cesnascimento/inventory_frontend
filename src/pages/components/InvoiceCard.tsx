import { Table } from "antd";
import moment from "moment";
import { formatCurrency } from "../../utils/functions";

export default function InvoiceCard({
  itemList,
  columns,
  createdAt,
}: {
  itemList: any;
  columns: any;
  createdAt?: any;
}) {
  const total = itemList?.reduce((acc: number, item: any) => {
    acc += item.qty * item.mainPrice;
    return acc;
  }, 0);

  return (
    <div className="cardMain">
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

export function InvoiceCardV2({
  receiptRef,
  itemList,
  columns,
  createdAt,
  printedBy,
  invoice,
}: {
  receiptRef?: any;
  itemList: any;
  columns: any;
  createdAt?: any;
  printedBy?: string;
  invoice?: string;
}) {
  const total = itemList?.reduce((acc: number, item: any) => {
    acc +=  item.total;
    return acc;
  }, 0);

  return (
    <>
      <div
        className="cardMain"
        style={{
          maxWidth: "350px",
        }}
        ref={receiptRef}
      >
        <div className="receiptHead">
          <div
            className="title"
            style={{
              textAlign: "center",
              fontSize: "14px",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Toun Stores
          </div>
          <div
            className="address"
            style={{
              textAlign: "center",
              fontSize: "12px",
            }}
          >
            H30-H40 Olabisi Onabanjo Market (New Market), Ijebu Ode, Ogun State.
          </div>
          <div
            className="address"
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Phone no: 07037170680, 07086618816
          </div>
          <div
            className="invoiceInfo"
            style={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            Invoice: {`T_INV_${invoice}`}
          </div>
          <div className="headerContent">
            <div>
              <div
                className="info"
                style={{
                  fontSize: "12px",
                }}
              >
                Printed By:
              </div>
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                {printedBy}
              </div>
            </div>
            <div>
              <div
                className="info"
                style={{
                  fontSize: "12px",
                }}
              >
                Date:
              </div>
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                {moment(createdAt ? new Date(createdAt) : new Date()).format(
                  "DD/MM/YYYY"
                )}
              </div>
            </div>
          </div>
        </div>
        <hr />
        <table width="100%" style={{ textAlign: "left" }}>
          <thead>
            <tr>
              {columns.map((item: any, i: number) => {
                if (!item.title) return null;
                return (
                  <th style={{ fontSize: "12px", padding: "2px 5px" }} key={i}>
                    {item.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {itemList.map((item: any, i: number) => (
              <tr key={i}>
                <td style={{ fontSize: "11px", padding: "5px" }} key={i}>
                  {item.item}
                </td>
                <td style={{ fontSize: "11px", padding: "5px" }} key={i}>
                  {item.qty}
                </td>
                <td style={{ fontSize: "11px", padding: "5px" }} key={i}>
                  {item.price}
                </td>
                <td style={{ fontSize: "11px", padding: "5px" }} key={i}>
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div className="headerContent">
          <div />
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            Total: <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <br />
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          NO REFUNDS CAN BE MADE AFTER PAYMENTS
        </div>
      </div>
    </>
  );
}
