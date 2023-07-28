import React, { useContext, useState, useCallback, useEffect } from 'react'
import { store } from "../../store";
import Axios from "axios";
/* import { SALE_BY_SHOP_URL } from "../../utils/myPaths"; */
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
  getAppGroups
} from "../../utils/functions";
import Loader from "./Loader";
import { PieChart, Pie, Sector, Cell, Label } from "recharts";
import { Space, Typography } from 'antd';
import { INVENTORY_MOBILE_URL } from "../../utils/myPaths";



interface GroupData {
  name: string;
  equip: number;
}


export default function SalePieChart() {
  const [saleChart, setSaleChart]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [fetching, setFetching] = useState(true);
  const [dataDesktop, setDataDesktop] = useState<GroupData[]>([]);
  const [dataNotebook, setDataNotebook] = useState<GroupData[]>([]);
  const [inventory, setInventory]: any = useState([]);
  const [totalCount, setTotalCount] = useState(0);


  const { Text } = Typography;
  const {
    state: { userToken },
  } = useContext(store);
  const useActiveIndex = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback((_, index) => {
      setActiveIndex(index);
    }, []);
    return { activeIndex, onPieEnter };
  };
  const { activeIndex: activeIndex1, onPieEnter: onPieEnter1 } = useActiveIndex();
  const { activeIndex: activeIndex2, onPieEnter: onPieEnter2 } = useActiveIndex();
  const { activeIndex: activeIndex3, onPieEnter: onPieEnter3 } = useActiveIndex();
  const { activeIndex: activeIndex4, onPieEnter: onPieEnter4 } = useActiveIndex();


  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF0000", // Vermelho
    "#00FF00", // Verde
    "#0000FF", // Azul
    "#FFFF00", // Amarelo
    "#FF00FF", // Magenta
    "#00FFFF"  // Ciano
  ];


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
        {`${value}`}
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

      console.log('aqui data desktop', dataDesktop)
    }
  };

  const getInventory = async () => {
    setFetching(true);

    const res = await Axios.get(
      INVENTORY_MOBILE_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e) 
    );
    if (res) {
      setTotalCount(res.data.count);
      const data = res.data.results.map((item: any, i: number) => ({
        marca: item.marca,
        name: item.colaborador?.name
      }))
      const totalMobileFilter = data.filter((item:any) => item.name === 'colaborador teste');
      setInventory([...totalMobileFilter]);

      console.log('aqui o grafico do mobile', data)
    }
    
    setFetching(false);
  };

  console.log('inventario',inventory)
  
  const sumValuesData = (data:any, propertyName:string) => data
  .filter((item:any) => item.name === propertyName)
  .reduce((sum:number, item:any) => sum + item.value, 0);
  

  useEffect(() => {
    getGroups()
  }, [currentPage, search])
  useEffect(() => {
    getInventory()
  }, [currentPage, search])

  console.log('NOVO AQUI', inventory.filter((item:any) => item.name === 'colab teste'))
  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Total Estoque</h3>
        </div>
        <Space direction="vertical">
        <Text strong>Desktop: {sumValuesData(dataDesktop, 'teste')}</Text>
        <Text strong>Notebook: {sumValuesData(dataNotebook, 'teste')}</Text>
        <Text strong>Mobile: {inventory.length}</Text>
        </Space>
      </div>
      <br />
      {/* <PurchaseSummary /> */}
    </div>
  );
}
