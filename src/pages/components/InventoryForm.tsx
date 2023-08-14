import { SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, } from "antd";
import Axios from "axios";
import { store } from "../../store";
import { INVENTORY_URL } from "../../utils/myPaths";
import {
    getAppGroups,
    getAppColab,
    NotificationTypes,
    openNotificationWithIcon,
} from "../../utils/functions";

const { Option } = Select;

const { TextArea } = Input;

export default function InventoryForm({
    onAddComplete,
    activeItem,
}: {
    onAddComplete: () => void;
    activeItem: any;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const {
        state: { userToken, groups, colaborador },
    } = useContext(store);
    const [selectedImage, setSelectedImage]: any = useState(null);
    const [imageContent, setImageContent]: any = useState("");
    const [form] = Form.useForm();
    const imageUpload: any = useRef();
    const [groupItem, setGroupItem] = useState([]);
    const [colabItem, setColabItem] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState("");

    const handleSearch = (value: SetStateAction<string>) => {
        setSearchText(value);
    };

    const handleFilterOption = (input: string, option: { children: string; }) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const onFinish = async (values: any) => {
        setIsLoading(true);
        let formData;

        if (selectedImage) {
            formData = new FormData();
            for (let key in values) {
                formData.append(key, values[key]);
            }
            formData.append("photo", selectedImage);
        } else {
            formData = values;
        }
        let url = INVENTORY_URL
        if (activeItem) {
            url = INVENTORY_URL + `/${activeItem.id}`
        }
        const result = await Axios[activeItem ? "patch" : "post"](url, formData, {
            headers: { Authorization: userToken },
        }).catch((e) =>
            console.log(e)
            /* openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e)) */
        );
        if (result) {
            openNotificationWithIcon(
                NotificationTypes.SUCCESS,
                `Item ${activeItem ? 'Added' : 'Updated'} Successfully`
            );
            form.resetFields();
            onAddComplete();
        }
        setIsLoading(false);
    };

    const getGroups = async () => {
        const res = await getAppGroups(userToken);
        if (res) {
            setGroupItem(res.data.results);
        }
    };

    const getColabs = async (page?: number) => {
        const res = await getAppColab(userToken, page);
        if (res) {
            setColabItem(res.data.results);
        }
    };

    useEffect(() => {
        if (groups) {
            setGroupItem(groups);
        } else {
            getGroups();
        }
    }, []);

    useEffect(() => {
        if (colaborador) {
            setColabItem(colaborador);
        } else {
            getColabs();
        }
    }, []);

    const handleLogoClick = () => {
        imageUpload.current.value = null;
        imageUpload.current.click();
    };

    const handleImageSelect = (e: any) => {
        setSelectedImage(e.target.files[0]);
        readImage(e.target.files[0]);
    };

    const readImage = (selectedImage: any) => {
        var reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = function () {
            setImageContent(reader.result);
        };
    };

    useEffect(() => {
        if (activeItem && groupItem.length && colabItem.length > 0) {
            form.setFieldsValue({ ...activeItem, local_id: activeItem.local?.id, colaborador_id: activeItem.colaborador?.id })
            setImageContent(activeItem.photo)
        }
    }, [activeItem, groupItem, colabItem])


    const handleScroll = (event: any) => {
        const element = event.target;

        const scrollPosition = element.scrollTop + element.clientHeight;
        const totalHeight = element.scrollHeight;

        if (scrollPosition === totalHeight) {
            getColabs(2)

            // carregue mais itens de colaboradores
            setCurrentPage(currentPage + 1);
            getAppColab(userToken, currentPage + 1, '').then((response) => {
                if (response) {
                    const newColabItems = response.data.items;
                    if (Array.isArray(newColabItems)) {
                        setColabItem([...colabItem, ...newColabItems]);
                    }
                }
            });
        }
    };


    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const filteredOptions = colabItem.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div>
            <input
                type="file"
                ref={imageUpload}
                accept="image/png, image/gif, image/jpeg"
                onChange={handleImageSelect}
                style={{ display: "none" }}
            />

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="flex align-center justify-center">
                    <div className="uploadContainer" onClick={handleLogoClick}>
                        {selectedImage ? (
                            <img src={imageContent} alt="" />
                        ) : (
                            <CameraOutlined />
                        )}
                    </div>
                </div>
                <Form.Item
                    label="Local"
                    rules={[{ required: true, message: "Please select category" }]}
                    name="local_id"
                >
                    <Select placeholder="Selecione o local" allowClear>
                        {groupItem.map((item: any, i: number) => (
                            <Option key={i} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Patrimônio"
                    name="patrimonio"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Digite o patrimônio" />
                </Form.Item>
                <Form.Item
                    label="HostName"
                    name="hostname"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Usuário"
                    name="usuario"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name usuario" />
                </Form.Item>
                <Form.Item
                    label="Colaborador"
                    rules={[{ required: true, message: "Please select category" }]}
                    name="colaborador_id"
                >
                    <Select
                    placeholder="Selecione colaborador"
                    allowClear
                    className="colaborador"
                    onPopupScroll={handleScroll}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    filterOption={false}
                    showSearch
                    onSearch={handleSearchChange}
                    >
                    {filteredOptions.sort((a, b) => a.name.localeCompare(b.name))
                        .map((item: any, i: number) => (
                        <Option key={i} value={item.id}>
                            {item.name}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="S.O"
                    name="sistema_operacional"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Digite o sistema operacional" />
                </Form.Item>
                <Form.Item
                    label="Service Tag"
                    name="service_tag"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="NF S.O"
                    name="nf_so"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Empresa"
                    name="empresa"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Marca"
                    name="marca"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Modelo"
                    name="modelo"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Configuração"
                    name="configuracao"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <TextArea rows={4} placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Motivo"
                    name="motivo_depreciado"
                >
                    <TextArea rows={4} placeholder="Enter item name" />
                </Form.Item>
                <Button block type="primary" htmlType="submit" loading={isLoading}>
                    {activeItem ? "Atualizar" : "Inserir"}
                </Button>
            </Form>
        </div>
    );
}
