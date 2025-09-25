import { queryOptions, useQuery } from "@tanstack/react-query";
import { Badge, Card, Col, Row, Spin } from "antd";
import { useMemo } from "react";
import { getBalance } from "../../apis/BalanceApi";
import { LoadingOutlined } from "@ant-design/icons";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BALANCE_QUERY_KEY = "anual-saving" as const;

const createAnnualSavingsCardQuery = (year: number) =>
  queryOptions({
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: () =>
      getBalance({
        year: year,
      }),
    staleTime: 5 * 60 * 1000,
  });

interface AnnualSavingsCardProps {
  year?: number;
}

export default function AnnualSavingsCard({
  year = dayjs().year(),
}: AnnualSavingsCardProps) {
  const queryConfig = useMemo(() => createAnnualSavingsCardQuery(year), []);

  const { data, isFetching } = useQuery(queryConfig);
  const transformed = useMemo(() => {
    if (!data) return [];
    return Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { category: item.category };
        }
        acc[item.category][item.currencySymbol] = item.total;
        return acc;
      }, {} as Record<string, any>)
    );
  }, [data]);

  return (
    <Col>
      <Card title="Ahorrado en el ultimo año" style={{ marginTop: 20 }}>
        {isFetching ? (
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        ) : (
          <BarChart width={600} height={400} data={transformed}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ARS" fill="#82ca9d" />
            <Bar dataKey="USD" fill="#8884d8" />
          </BarChart>
        )}
      </Card>
    </Col>
  );
}
