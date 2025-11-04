import { createFileRoute } from "@tanstack/react-router";
import { Card, Segmented } from "antd";
import { useCallback, useState } from "react";
import { BankEnum } from "../enums/BankEnum";
import { TypeEnum } from "../enums/TypeExpense";
import MovementTable from "../components/movements/tables/MovementTable";
import { HistoryOutlined, RiseOutlined } from "@ant-design/icons";
import { CurrencyEnum } from "../enums/CurrencyEnum";
import AddEditMovementModal from "../components/modals/movements/AddEditMovementModal";
import FiltrosMovement from "../components/movements/FiltrosMovement";

export const Route = createFileRoute("/movement")({
  component: RouteComponent,
});
export type MovementFilters = {
  description: string | null;
  type: TypeEnum[];
  bank: BankEnum[];
  categories: string[];
  isLive: boolean;
  currency: CurrencyEnum[];
};
function RouteComponent() {
  const [filters, setFilters] = useState<MovementFilters>({
    currency: [],
    description: null,
    type: [],
    bank: [],
    categories: [],
    isLive: true,
  });

  const handleFilterChange = useCallback(
    (
      key: keyof MovementFilters,
      value: string | boolean | null | BankEnum[] | TypeEnum[] | string[]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  return (
    <div style={{ paddingInline: 100, marginLeft: 80, marginRight: 80 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
          gap: 16,
        }}
      >
        <Segmented
          options={[
            {
              label: (
                <span>
                  <RiseOutlined /> Actuales
                </span>
              ),
              value: true,
            },
            {
              label: (
                <span>
                  <HistoryOutlined /> Históricos
                </span>
              ),
              value: false,
            },
          ]}
          value={filters.isLive}
          onChange={(val) => handleFilterChange("isLive", val)}
          size="large"
          shape="round"
        />

        <AddEditMovementModal />
      </div>
      <FiltrosMovement filters={filters} onChange={handleFilterChange} />

      <Card title="Movimientos" style={{ marginBottom: 16, padding: 0 }}>
        <MovementTable filters={filters} />
      </Card>
    </div>
  );
}
