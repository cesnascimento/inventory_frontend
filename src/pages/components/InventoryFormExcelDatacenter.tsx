import { Button, Form } from 'antd';
import { useContext, useState } from 'react'
import Axios from "axios"
import { store } from '../../store';

export default function InventoryFormExcel({
    onAddComplete
}: { onAddComplete: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const { state: { userToken } } = useContext(store)
    const [selectedFile, setSelectedFile]: any = useState(null)
    const [csvUrl, setCsvUrl] = useState<string | null>(null);
    const [form] = Form.useForm()

    const handleFileSelect = (e: any) => {
        setSelectedFile(e.target?.files[0])
    }

    const onFinish = async (values: any) => {
        Axios({
            method: 'get',
            url: 'api/inventory-csv/', // coloque aqui a URL da sua view de export
            responseType: 'blob',
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventory.csv'); // nome do arquivo a ser baixado
            document.body.appendChild(link);
            link.click();
          });
    }

    const exportInventoryCSV = async () => {
        try {
          const userToken = localStorage.getItem("userToken");
          const res = await Axios.get('http://10.74.51.28:8000/app/export-desktop-csv/', {
            headers: {
              Authorization: userToken,
            },
            responseType: "blob", // Para obter uma resposta binária
          });
          const blob = new Blob([res.data], { type: "text/csv" }); // Transforma a resposta em Blob
          const url = window.URL.createObjectURL(blob); // Cria uma URL para download do arquivo
          const link = document.createElement("a"); // Cria um elemento de âncora
          link.href = url; // Define o URL de download do arquivo
          link.setAttribute("download", "inventory.csv"); // Define o nome do arquivo a ser baixado
          document.body.appendChild(link); // Adiciona o elemento ao corpo do documento
          link.click(); // Inicia o download do arquivo
        } catch (error) {
          console.log(error);
        }
      };


    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                onFinish={exportInventoryCSV}
            >

                <Button block type="primary" htmlType="submit" loading={isLoading}>DOWNLOAD</Button>
            </Form>
        </div>
    )
}
