import { Button, Form, Select } from "antd";
import { useContext, useState } from "react";
import { store } from "../../store";
import { getAppShops } from "../../utils/functions";
import { useEffect } from "react";

const { Option } = Select;

export default function ShopFormSelect({
  onAddComplete,
}: {
  onAddComplete: (item: any) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    state: { userToken },
  } = useContext(store);
  const [shops, setShops]: any = useState([]);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    onAddComplete(values);
  };

  const getShop = async () => {
    setIsLoading(true);

    const res = await getAppShops(userToken, 1, "");

    if (res) {
      setShops(res.data.results);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getShop();
  }, []);

  return (
    <div>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="Shop"
          name="shop"
          rules={[{ required: true, message: "Please select a shop" }]}
        >
          <Select placeholder="Select shop" allowClear>
            {shops.map((item: any, i: number) => (
              <Option key={i} value={JSON.stringify(item)}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button block type="primary" htmlType="submit" loading={isLoading}>
          Continue
        </Button>
      </Form>
    </div>
  );
}
