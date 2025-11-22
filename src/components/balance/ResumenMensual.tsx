import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useBalance } from "../../apis/hooks/useBalance";
import BalanceCard from "./BalanceCard";
import { Col, Row, Select, Space, Typography } from "antd";
import type { Balance } from "../../models/Balance";
import { useEffect, useState } from "react";
const { Title, Text } = Typography;

interface ResumenMensualProps {
  year?: number;
  month?: number;
}

export default function ResumenMensual({
  year = dayjs().year(),
  month = dayjs().month() + 1,
}: ResumenMensualProps) {
  const { data: rawData, isFetching } = useBalance(year, month);

  const balance: Balance[] = rawData
    ? [...(rawData.GASTO ?? []), ...(rawData.INGRESO ?? [])]
    : [];

  const currencies = Array.from(new Set(balance.map((b) => b.symbol)));

  const [selectedCurrency, setSelectedCurrency] = useState<string>();

  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0]);
    }
  }, [currencies]);

  const filtered = balance.filter(
    (b) => !selectedCurrency || b.symbol === selectedCurrency
  );

  const ingreso = filtered.find((b) => b.type === "INGRESO");
  const gasto = filtered.find((b) => b.type === "GASTO");
  const total = {
    balance: (ingreso?.balance ?? 0) - (gasto?.balance ?? 0),
  };

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <Col xs={24} sm={12} lg={8}>
          <Space direction="vertical" size={1}>
            <Title level={2} style={{ margin: 0 }}>
              Balance Financiero
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Vista detallada de ingresos y gastos del mes actual
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Select
            style={{ width: 200 }}
            placeholder="Todas las Monedas"
            allowClear
            value={selectedCurrency}
            onChange={setSelectedCurrency}
            options={currencies.map((currency) => ({
              label: currency,
              value: currency,
            }))}
          />
        </Col>
      </Row>

      <Row
        gutter={16}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <BalanceCard
          isFetching={isFetching}
          title="Ingresos Totales"
          amount={ingreso?.balance ?? 0}
          subtitle={`Moneda ${selectedCurrency ?? ""}`}
          icon={<ArrowUpOutlined style={{ color: "#3f8600" }} />}
        />
        <BalanceCard
          isFetching={isFetching}
          title="Gastos Totales"
          amount={gasto?.balance ?? 0}
          subtitle={`Moneda ${selectedCurrency ?? ""}`}
          icon={<CalendarOutlined style={{ color: "#cf1322" }} />}
        />
        <BalanceCard
          isFetching={isFetching}
          title="Balance Total"
          amount={total?.balance ?? 0}
          subtitle={`Moneda ${selectedCurrency ?? ""}`}
          icon={
            total && total.balance > 0 ? (
              <ArrowUpOutlined style={{ color: "#3f8600" }} />
            ) : (
              <ArrowDownOutlined style={{ color: "#cf1322" }} />
            )
          }
        />
      </Row>
    </>
  );
}
