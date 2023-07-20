import React from 'react'
import { useContext } from "react";
import { useState } from "react";
import { store } from "../../store";
import DateSelector from "./DateSelector";
import Axios from "axios";
/* import { SALE_BY_SHOP_URL } from "../../utils/myPaths"; */
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
  getAppGroups
} from "../../utils/functions";
import { useEffect } from "react";
/* import Chart from "react-google-charts"; */
import Loader from "./Loader";
import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GroupData {
  name: string;
  equip: number;
}

export default function SalePerformance() {
  const [saleChart, setSaleChart]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  /* const groups:any = ['Equipamentos']
  const lojas:any = ['Loja'] */
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [lojas, setLojas] = useState<GroupData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const {
    state: { userToken },
  } = useContext(store);
  const [newData, setNewData] = useState<GroupData[]>([]);

  useEffect(() => {
    getGroups()
  }, [currentPage, search])

  const getGroups = async () => {
    const res = await getAppGroups(userToken, currentPage, search);

    if (res) {
      const newData: GroupData[] = res.data.results.map((item: any) => ({
        name: item.name,
        equip: item.total_items,
      }));

      setLojas((prevLojas) => [...prevLojas, ...newData]);
      setGroups((prevGroups) => [...prevGroups, ...newData]);
      setNewData(newData); // Atualizar a nova variável de estado
    }
  };
  

  useEffect(() => {
    console.log('AQUI É O GROUPS A', groups)
    console.log('aqui é groups b', [[lojas],[groups]])
  }, [lojas, groups])


  const data: GroupData[] = [...lojas, ...groups];

  console.log('AQUI É O NEWDATA',newData)

  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Equipamentos por loja</h3>
          <DateSelector picker="month" />
        </div>
        <BarChart
        className="BarChartSvg"
        width={900}
        height={500}
        data={newData}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={100} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="equip" fill="#8884d8" name="Equipamentos x Lojas" />
      </BarChart>

      </div>
    </div>
  );
}
