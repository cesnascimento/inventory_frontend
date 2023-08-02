import React, { useContext, useState, useEffect } from 'react'
import { store } from "../../store";
import Axios from "axios";
import {
  getAppGroups
} from "../../utils/functions";
import { Space, Typography } from 'antd';
import { INVENTORY_MOBILE_URL } from "../../utils/myPaths";


interface GroupData {
  name: string;
  value: number;
}


export default function SalePieChart() {
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
      const dataMobile = res.data.results.map((item: any, i: number) => ({
        marca: item.marca,
        name: item.colaborador?.name
      }))
      const totalMobileFilter = dataMobile.filter((item:any) => item.name === 'colaborador teste');
      setInventory([...totalMobileFilter]);
    }
    
    setFetching(false);
  };

  
  const sumValuesData = (data:any, propertyName:string) => data
  .filter((item:any) => item.name === propertyName)
  .reduce((sum:number, item:any) => sum + item.value, 0);
  

  useEffect(() => {
    getGroups()
  }, [currentPage, search])
  useEffect(() => {
    getInventory()
  }, [currentPage, search])

  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Total Estoque</h3>
        </div>
        <Space direction="vertical">
        <Text strong>Desktop: {sumValuesData(dataDesktop, 'local teste')}</Text>
        <Text strong>Notebook: {sumValuesData(dataNotebook, 'local teste')}</Text>
        <Text strong>Mobile: {inventory.length}</Text>
        </Space>
      </div>
      <br />
      {/* <PurchaseSummary /> */}
    </div>
  );
}
