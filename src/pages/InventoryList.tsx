import React from "react";
import Inventory from "./Inventory";

export default function InventoryList() {
  return (
    <div style={{ padding: "20px" }}>
      <Inventory noAuth={true} />
    </div>
  );
}
