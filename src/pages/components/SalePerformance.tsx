import { useContext, useState, useEffect} from "react";
import { store } from "../../store";
import {
  getAppGroups
} from "../../utils/functions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface GroupData {
  name: string;
  equip: number;
}

export default function SalePerformance() {
  const [saleChart, setSaleChart]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const {
    state: { userToken },
  } = useContext(store);
  const [newData, setNewData] = useState<GroupData[]>([]);

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

      setNewData(newData); // Atualizar a nova variável de estado

    }
  };


  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Equipamentos por Local</h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh"
          }}
        >
          <BarChart
            className="BarChartSvg"
            width={600}
            height={400}
            data={newData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={70} />
            <YAxis />
            <Tooltip />
            {/* <Bar dataKey="equip" fill="#8884d8" /> */}
            <Bar dataKey="equip" name="Equipamentos:">
              {newData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>

      </div>
    </div>
  );
}
