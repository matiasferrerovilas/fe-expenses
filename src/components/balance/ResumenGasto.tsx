import { queryOptions, useQuery } from "@tanstack/react-query";
import { Card, Row, Spin } from "antd";
import { useMemo } from "react";
import { getBalance } from "../../apis/BalanceApi";
import { LoadingOutlined } from "@ant-design/icons";
import { CurrencyEnum } from "../../enums/CurrencyEnum";

const BALANCE_QUERY_KEY = ["balance"] as const;

const createBalanceFactoryQuery = () =>
  queryOptions({
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: () => getBalance(),
    staleTime: 5 * 60 * 1000,
  });

export default function ResumenGasto() {
  const queryConfig = useMemo(() => createBalanceFactoryQuery(), []);

  const { data, isFetching } = useQuery(queryConfig);
  return (
    <Row gutter={16} justify="center" style={{ marginTop: 20, gap: 20 }}>
      <Card
        style={{
          width: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {isFetching ? (
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        ) : (
          <div>
            {data &&
            data.filter((Item) => Item.symbol == CurrencyEnum.ARS).length > 0
              ? data[0].balance.toFixed(2)
              : "0.00"}
          </div>
        )}
      </Card>
      <Card
        style={{
          width: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {isFetching ? (
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        ) : (
          <div>
            {data &&
            data.filter((Item) => Item.symbol == CurrencyEnum.USD).length > 0
              ? data[1].balance.toFixed(2)
              : "0.00"}
          </div>
        )}
      </Card>
    </Row>
  );
}
