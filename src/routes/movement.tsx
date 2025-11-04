import { createFileRoute } from "@tanstack/react-router";
import { Card, Segmented } from "antd";
import { useCallback, useRef, useState } from "react";
import { HistoryOutlined, RiseOutlined } from "@ant-design/icons";
import MovementTable from "../components/movements/tables/MovementTable";
import AddEditMovementModal from "../components/modals/movements/AddEditMovementModal";
import FiltrosMovement from "../components/movements/FiltrosMovement";
import { BankEnum } from "../enums/BankEnum";
import { TypeEnum } from "../enums/TypeExpense";
import { CurrencyEnum } from "../enums/CurrencyEnum";

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

  const filtersRef = useRef(filters);

  const handleFiltersChange = useCallback((newFilters: MovementFilters) => {
    filtersRef.current = newFilters;
    setFilters(newFilters);
  }, []);

  const handleLiveChange = useCallback((val: boolean) => {
    setFilters((prev) => ({ ...prev, isLive: val }));
  }, []);

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
          onChange={handleLiveChange}
          size="large"
          shape="round"
        />

        <AddEditMovementModal />
      </div>

      <FiltrosMovement
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <Card title="Movimientos" style={{ marginBottom: 16, padding: 0 }}>
        <MovementTable filters={filters} />
      </Card>
    </div>
  );
}
