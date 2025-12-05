import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import CalendarOutlined from "@ant-design/icons/CalendarOutlined";

import dayjs from "dayjs";
import { useBalance } from "../../apis/hooks/useBalance";
import BalanceCard from "./BalanceCard";
import { Row } from "antd";
import type { BalanceFilters } from "../../routes/balance";

interface ResumenMensualProps {
  filters: BalanceFilters;
}

export default function ResumenMensual({ filters }: ResumenMensualProps) {
  filters.year = dayjs().year();
  filters.month = dayjs().month() + 1;
  const { data: rawData, isFetching } = useBalance(filters);

  const ingreso = rawData?.INGRESO ?? 0;
  const gasto = rawData?.GASTO ?? 0;
  const balanceTotal = ingreso - gasto;

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <BalanceCard
          isFetching={isFetching}
          title="Ingresos Totales"
          amount={ingreso ?? 0}
          subtitle={`Moneda ${filters.currency ?? ""}`}
          icon={<ArrowUpOutlined style={{ color: "#3f8600" }} />}
        />
        <BalanceCard
          isFetching={isFetching}
          title="Gastos Totales"
          amount={gasto ?? 0}
          subtitle={`Moneda ${filters.currency ?? ""}`}
          icon={<CalendarOutlined style={{ color: "#cf1322" }} />}
        />
        <BalanceCard
          isFetching={isFetching}
          title="Balance Total"
          amount={balanceTotal ?? 0}
          subtitle={`Moneda ${filters.currency ?? ""}`}
          icon={
            balanceTotal > 0 ? (
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
