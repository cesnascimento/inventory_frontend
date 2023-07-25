import React, { useContext, useState, useCallback } from 'react'
import { store } from "../../store";
import Axios from "axios";
/* import { SALE_BY_SHOP_URL } from "../../utils/myPaths"; */
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
  getAppGroups
} from "../../utils/functions";
import { useEffect } from "react";
import Chart from "react-google-charts";
import Loader from "./Loader";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/* import PurchaseSummary from "./PurchaseSummary"; */

interface GroupData {
  name: string;
  equip: number;
}

export default function SalePieChart() {
  const [saleChart, setSaleChart]: any = useState([]);
  const [dataDesktop, setDataDesktop] = useState<GroupData[]>([]);
  const [dataNotebook, setDataNotebook] = useState<GroupData[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [fetching, setFetching] = useState(true);
  const {
    state: { userToken },
  } = useContext(store);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${value}%`}
      </text>
    );
  };

  const getGroups = async () => {
    const res = await getAppGroups(userToken, currentPage, search);

    if (res) {
      const dataDesktop: GroupData[] = res.data.results.map((item: any) => ({
        name: item.name,
        value: Number(item.desktop_items),
      }));
      const dataNotebook: GroupData[] = res.data.results.map((item: any) => ({
        name: item.name,
        value: Number(item.notebook_items)
      }))



      setDataDesktop(dataDesktop); // Atualizar a nova variável de estado
      setDataNotebook(dataNotebook); // Atualizar a nova variável de estado

      console.log('aqui res do dashboard2', dataDesktop)
    }
  };

  useEffect(() => {
    getGroups()
  }, [currentPage, search])


  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Gráfico dos Inventários</h3>
        </div>
        <PieChart width={800} height={400}>
          <Pie
            data={dataDesktop}
            cx="35%"
            cy="30%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataDesktop.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text x="30%" y="55%" textAnchor="middle" fontSize={12} fill="#010101">
            Desktop x Loja
          </text>
          <Pie
            data={dataNotebook}
            cx="75%"
            cy="30%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataDesktop.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text x="70%" y="55%" textAnchor="middle" fontSize={12} fill="#010101">
            Notebook x Loja
          </text>
          <Legend
            align="right"
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{ paddingBottom: '10px' }}
          />
        </PieChart>
      </div>
      <br />
      {/* <PurchaseSummary /> */}
    </div>
  );
}
