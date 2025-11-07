import { createFileRoute } from "@tanstack/react-router";
import { Card } from "antd";
import { useCallback, useRef, useState } from "react";
import MovementTable from "../components/movements/tables/MovementTable";
import FiltrosMovement from "../components/movements/FiltrosMovement";
import { BankEnum } from "../enums/BankEnum";
import { TypeEnum } from "../enums/TypeExpense";
import { CurrencyEnum } from "../enums/CurrencyEnum";
import AddMovementModal from "../components/modals/movements/AddMovementModal";

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

  return (
    <div>
      <FiltrosMovement
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
        AddEditMovementModal={AddMovementModal}
      />

      <Card title="Movimientos" style={{ marginBottom: 16, padding: 0 }}>
        <MovementTable filters={filters} />
      </Card>
    </div>
  );
}
