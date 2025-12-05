import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import { Card, Col, Spin } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useBalanceSeparateByCategory } from "../../apis/hooks/useBalance";
import type { BalanceFilters } from "../../routes/balance";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  filters: BalanceFilters;
  onFiltersChange: (filters: BalanceFilters) => void;
}

export default function BalanceGrafico({ filters }: Props) {
  const appliedFilters = {
    ...filters,
    year: dayjs().year(),
  };
  const { data: balance = [], isFetching } =
    useBalanceSeparateByCategory(appliedFilters);

  const transformed = useMemo(() => {
    if (!balance) return [];

    return balance.map((item) => ({
      name: `${item.category}`,
      monto: item.total,
    }));
  }, [balance]);

  return (
    <Col xs={24} sm={20} lg={8}>
      <Card
        title="Totales clasificados por Categoria"
        style={{ marginTop: 20 }}
      >
        {isFetching ? (
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        ) : (
          <BarChart
            style={{
              width: "100%",
              maxHeight: "100%",
              aspectRatio: 1,
            }}
            responsive
            data={transformed}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="monto"
              fill="#8884d8"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        )}
      </Card>
    </Col>
  );
}
