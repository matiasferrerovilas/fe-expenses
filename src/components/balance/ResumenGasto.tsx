import { queryOptions, useQuery } from "@tanstack/react-query";
import { Badge, Card, Row, Spin } from "antd";
import { useMemo } from "react";
import { getBalance } from "../../apis/BalanceApi";
import { LoadingOutlined } from "@ant-design/icons";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import dayjs from "dayjs";

const BALANCE_QUERY_KEY = "balance" as const;

const createBalanceFactoryQuery = (year: number, month: number) =>
  queryOptions({
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: () =>
      getBalance({
        year: year,
        month: month,
      }),
    staleTime: 5 * 60 * 1000,
  });

interface ResumenGastoProps {
  year?: number;
  month?: number;
}

export default function ResumenGasto({
  year = dayjs().year(),
  month = dayjs().month() + 1,
}: ResumenGastoProps) {
  const queryConfig = useMemo(() => createBalanceFactoryQuery(year, month), []);

  const { data, isFetching } = useQuery(queryConfig);
  return (
    <Row gutter={16} justify="center" style={{ marginTop: 20, gap: 20 }}>
      <Badge.Ribbon text={CurrencyEnum.ARS} color="blue">
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
                ? `$${data[0].balance.toFixed(2)}`
                : "0.00"}
            </div>
          )}
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text={CurrencyEnum.USD} color="green">
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
                ? `$${data[1].balance.toFixed(2)}`
                : "0.00"}
            </div>
          )}
        </Card>
      </Badge.Ribbon>
    </Row>
  );
}
