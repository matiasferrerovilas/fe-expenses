import { LoadingOutlined } from "@ant-design/icons";
import { Card, Col, Spin } from "antd";
import { Pie } from "@ant-design/plots";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useBalanceSeparateByCategory } from "../../apis/hooks/useBalance";
import type { BalanceByCategory } from "../../models/BalanceByCategory";
import type { BalanceFilters } from "../../routes/balance";

interface Props {
  filters: BalanceFilters;
  onFiltersChange: (filters: BalanceFilters) => void;
}
export default function BalanceGrafico({ filters }: Props) {
  filters.year = dayjs().year();
  const { data: balance = [], isFetching } =
    useBalanceSeparateByCategory(filters);

  const transformed = useMemo(() => {
    if (!balance) return [];
    return balance.map((item: BalanceByCategory) => ({
      type: item.category,
      value: item.total,
    }));
  }, [balance]);

  const config = {
    data: transformed,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  return (
    <Col xs={24} sm={20} lg={8}>
      <Card title="Gastado Mensualmente por Grupo" style={{ marginTop: 20 }}>
        {isFetching ? (
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        ) : (
          <Pie {...config} />
        )}
      </Card>
    </Col>
  );
}
