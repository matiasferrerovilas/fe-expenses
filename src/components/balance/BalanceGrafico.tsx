import { LoadingOutlined } from "@ant-design/icons";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Spin } from "antd";
import { Pie, PieChart } from "recharts";
import { getBalanceWithCategoryByYear } from "../../apis/BalanceApi";
import { useMemo } from "react";
import dayjs from "dayjs";

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

export default function BalanceGrafico() {
  const queryConfig = useMemo(() => createBalanceByCategoryFactoryQuery(), []);

  const { data, isFetching } = useQuery(queryConfig);

  const transformed = useMemo(() => {
    if (!data) return [];

    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    let index = 0;

    return Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            category: item.category,
            value: 0,
            fill: colors[index % colors.length],
          };
          index++;
        }

        acc[item.category][item.currencySymbol] = item.total;
        acc[item.category].value += item.total;

        return acc;
      }, {} as Record<string, any>)
    );
  }, [data]);
  return (
    <Row justify="center" gutter={16}>
      <Col xs={24} sm={20} lg={8}>
        <Card title="Gastado Anualmente" style={{ marginTop: 20 }}>
          {isFetching ? (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          ) : (
            <PieChart
              style={{
                width: "100%",
                maxWidth: "300px",
                maxHeight: "80vh",
                aspectRatio: 1,
              }}
            >
              <Pie
                data={transformed}
                innerRadius="80%"
                outerRadius="100%"
                cornerRadius="50%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
                isAnimationActive={true}
              />
            </PieChart>
          )}
        </Card>
      </Col>
    </Row>
  );
}
