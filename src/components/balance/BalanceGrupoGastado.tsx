import { Column } from "@ant-design/plots";
import { Card, Col } from "antd";
import dayjs from "dayjs";
import { useBalanceSeparateByGroup } from "../../apis/hooks/useBalance";
import type { ReactNode } from "react";

interface ChartData {
  group: string;
  total: number;
  currency: string;
}

interface TooltipItem {
  name: string;
  color: string;
  origin: ChartData;
}

interface TooltipRenderParams {
  title: string;
  items: TooltipItem[];
}

export default function BalanceGrupoGastado() {
  const { data: balance = [] } = useBalanceSeparateByGroup(
    dayjs().year(),
    dayjs().month() + 1
  );

  const data = balance.map((b) => ({
    group: b.groupDescription,
    total: Number(b.total),
    currency: b.currencySymbol,
  }));

  const config = {
    data,
    xField: "group",
    yField: "total",
    seriesField: "currency",
    stack: {
      groupBy: ["x", "series"],
      series: false,
    },
    colorField: "currency",
    tooltip: (item: ChartData) => ({ origin: item }),

    interaction: {
      tooltip: {
        render: (
          _: unknown,
          { title, items }: TooltipRenderParams
        ): ReactNode => {
          return (
            <div>
              <h4>{title}</h4>
              {items.map((item) => {
                const { name, color, origin } = item;
                return (
                  <div>
                    <div
                      style={{
                        margin: 0,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: color,
                            marginRight: 6,
                          }}
                        ></span>
                        <span>{name}</span>
                      </div>
                      <b>{origin["total"]}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    },
  };
  return (
    <Col xs={24} sm={20} lg={12}>
      <Card
        title="Gastado Mensualmente por Grupo y Moneda"
        style={{ marginTop: 20 }}
      >
        <Column {...config} />
      </Card>
    </Col>
  );
}
