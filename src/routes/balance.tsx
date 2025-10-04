import { createFileRoute } from "@tanstack/react-router";
import ResumenGasto from "../components/balance/ResumenGasto";
import Card from "antd/es/card/Card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Col, Row, Spin } from "antd";
import { useMemo } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBalanceWithCategoryByYear } from "../apis/BalanceApi";
import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";
import AnnualSavingsCard from "../components/balance/AnnualSavingsCard";

export const Route = createFileRoute("/balance")({
  component: RouteComponent,
});

const BALANCE_CATEGORY_QUERY_KEY = "balance-cateogry" as const;

const createBalanceByCategoryFactoryQuery = () =>
  queryOptions({
    queryKey: [BALANCE_CATEGORY_QUERY_KEY],
    queryFn: () =>
      getBalanceWithCategoryByYear({
        year: dayjs().year(),
      }),
    staleTime: 5 * 60 * 1000,
  });
function RouteComponent() {
  const queryConfig = useMemo(() => createBalanceByCategoryFactoryQuery(), []);

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
    <>
      <ResumenGasto />

      <Row justify="center" gutter={16}>
        <Col>
          <Card title="Gastado Anualmente" style={{ marginTop: 20 }}>
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
      </Row>
    </>
  );
}
