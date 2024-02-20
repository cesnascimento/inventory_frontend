import React, { useContext, useState, useCallback, useEffect } from 'react'
import { store } from '../../store'
import Axios from "axios"
import { getAppGroups } from '../../utils/functions'
import { PieChart, Pie, Sector, Cell, Label } from "recharts";
import { useDashboardContext } from '../../contexts/DashboardContext'
import { Button } from "antd";
import { INVENTORY_DATACENTER_URL, INVENTORY_MOBILE_URL } from '../../utils/myPaths'


interface GroupData {
  name: string;
  value: number;
}
interface Item {
  marca: string;
  descricao: string;
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 3;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={6} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 5}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={14}
      >{`Quantidade: ${value}`}</text>
    </g>
  );
};

function TopSellingItems() {

  const { filteredDashboard, setFilteredDashboard } = useDashboardContext()

  const [dataDesktop, setDataDesktop] = useState<GroupData[]>([]);
  const [dataNotebook, setDataNotebook] = useState<GroupData[]>([]);
  const [dataMobile, setDataMobile] = useState<GroupData[]>([]);
  const [dataDataCenter, setDataDataCenter] = useState<GroupData[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [fetching, setFetching] = useState(true);
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
    }
  };

  const getInventoryMobile = async () => {
    setFetching(true);
    const res = await Axios.get(
      INVENTORY_MOBILE_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e)
    );
    if (res) {
      /* const dataMobile = res.data.results.map((item: any, i: number) => ({
        name: item.marca,
        value: item.marca.length
      })) */
      const marcaCount: { [key: string]: number } = {};

      // Loop para contar as ocorrências de cada 'marca'
      for (const item of res.data.results as Item[]) {
        const marca = item.marca;
        marcaCount[marca] = (marcaCount[marca] || 0) + 1;
      }

      // Criando o array 'dataMobile' com as contagens
      const dataMobile: GroupData[] = [];
      for (const marca in marcaCount) {
        dataMobile.push({ name: marca, value: marcaCount[marca] });
      }
      setDataMobile(dataMobile)
    }

    setFetching(false);
  };
  const getInventoryDataCenter = async () => {
    setFetching(true);

    const res = await Axios.get(
      INVENTORY_DATACENTER_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e)
    );
    if (res) {
      /* const dataMobile = res.data.results.map((item: any, i: number) => ({
        name: item.marca,
        value: item.marca.length
      })) */
      const descricaoCount: { [key: string]: number } = {};

      // Loop para contar as ocorrências de cada 'marca'
      for (const item of res.data.results as Item[]) {
        const descricao = item.descricao;
        descricaoCount[descricao] = (descricaoCount[descricao] || 0) + 1;
      }

      // Criando o array 'dataMobile' com as contagens
      const dataDataCenter: GroupData[] = [];
      for (const descricao in descricaoCount) {
        dataDataCenter.push({ name: descricao, value: descricaoCount[descricao] });
      }
      setDataDataCenter(dataDataCenter)
    }

    setFetching(false);
  };

  useEffect(() => {
    getGroups()
  }, [currentPage, search])
  useEffect(() => {
    getInventoryMobile()
  }, [currentPage, search])
  useEffect(() => {
    getInventoryDataCenter()
  }, [currentPage, search])

  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Gráfico dos Inventários</h3>
          <Button type="primary" onClick={() => setFilteredDashboard('all')}>Exibir Todos</Button>
        </div>
        <PieChart width={700} height={530}>
          {(filteredDashboard === 'all' || filteredDashboard === 'desktop') && (
            <Pie
              activeIndex={activeIndex1}
              activeShape={renderActiveShape}
              data={dataDesktop}
              cx={filteredDashboard === 'desktop' ? '50%' : '25%'} // Centraliza horizontalmente
              cy={filteredDashboard === 'desktop' ? '50%' : '30%'} // Centraliza verticalmente
              innerRadius={filteredDashboard === 'desktop' ? 120 : 40}
              outerRadius={filteredDashboard === 'desktop' ? 200 : 60}
              dataKey="value"
              onMouseEnter={onPieEnter1}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {dataDesktop.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Label
                content={() => (
                  <text x={filteredDashboard === 'desktop' ? '50%' : '25%'} y={filteredDashboard === 'desktop' ? '5%' : '10%'} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
                    Desktop
                  </text>
                )}
              />
            </Pie>
          )}
          {(filteredDashboard === 'all' || filteredDashboard === 'notebook') && (<Pie
            activeIndex={activeIndex2}
            activeShape={renderActiveShape}
            data={dataNotebook}
            cx={filteredDashboard === 'notebook' ? '50%' : '70%'} // Centraliza horizontalmente
            cy={filteredDashboard === 'notebook' ? '50%' : '30%'} // Centraliza verticalmente
            innerRadius={filteredDashboard === 'notebook' ? 120 : 40}
            outerRadius={filteredDashboard === 'notebook' ? 200 : 60}
            dataKey="value"
            onMouseEnter={onPieEnter2}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {dataNotebook.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              content={() => (
                <text x={filteredDashboard === 'notebook' ? '50%' : '70%'} y={filteredDashboard === 'notebook' ? '5%' : '10%'} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
                  Notebook
                </text>
              )}
            />
          </Pie>)}
          {(filteredDashboard === 'all' || filteredDashboard === 'mobile') && (<Pie
            activeIndex={activeIndex3}
            activeShape={renderActiveShape}
            data={dataMobile}
            cx={filteredDashboard === 'mobile' ? '50%' : '25%'} // Centraliza horizontalmente
            cy={filteredDashboard === 'mobile' ? '50%' : '85%'} // Centraliza verticalmente
            innerRadius={filteredDashboard === 'mobile' ? 120 : 40}
            outerRadius={filteredDashboard === 'mobile' ? 200 : 60}
            dataKey="value"
            onMouseEnter={onPieEnter3}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {dataNotebook.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              content={() => (
                <text x={filteredDashboard === 'mobile' ? '50%' : '25%'} y={filteredDashboard === 'mobile' ? '5%' : '65%'} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
                  Mobile
                </text>
              )}
            />
          </Pie>)}
          {(filteredDashboard === 'all' || filteredDashboard === 'datacenter') && (<Pie
            activeIndex={activeIndex4}
            activeShape={renderActiveShape}
            data={dataDataCenter}
            cx={filteredDashboard === 'datacenter' ? '50%' : '70%'} // Centraliza horizontalmente
            cy={filteredDashboard === 'datacenter' ? '50%' : '85%'} // Centraliza verticalmente
            innerRadius={filteredDashboard === 'datacenter' ? 120 : 40}
            outerRadius={filteredDashboard === 'datacenter' ? 200 : 60}
            dataKey="value"
            onMouseEnter={onPieEnter4}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {dataNotebook.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              content={() => (
                <text x={filteredDashboard === 'datacenter' ? '50%' : '70%'} y={filteredDashboard === 'datacenter' ? '5%' : '65%'} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
                  DataCenter
                </text>
              )}
            />
          </Pie>)}
        </PieChart>
      </div>
      <br />
      {/* <PurchaseSummary /> */}
    </div>

  );
}

export default TopSellingItems;
