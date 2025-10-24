import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, Input, Row, Segmented, Select, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BankEnum } from "../enums/BankEnum";
import { TypeEnum } from "../enums/TypeExpense";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../apis/CategoryApi";
import MovementTable from "../components/movements/tables/MovementTable";
import {
  HistoryOutlined,
  PlusCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export const Route = createFileRoute("/movement")({
  component: RouteComponent,
});
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const CATEGORIES_QUERY_KEY = "categories" as const;

const createCategoryFactoryQuery = () =>
  queryOptions({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => getCategoriesApi(),
    staleTime: 5 * 60 * 1000,
  });
export type MovementFilters = {
  description: string | null;
  type: TypeEnum[];
  bank: BankEnum[];
  categories: string[];
  isLive: boolean;
};
function RouteComponent() {
  const [isLive, setLive] = useState(true);
  const [filters, setFilters] = useState<MovementFilters>({
    description: null,
    type: [],
    bank: [],
    categories: [],
    isLive: isLive,
  });
  const queryConfig = useMemo(() => createCategoryFactoryQuery(), []);

  const { data: categories = [] } = useSuspenseQuery(queryConfig);

  const handleFilterChange = useCallback(
    (
      key: keyof MovementFilters,
      value: string | boolean | null | BankEnum[] | TypeEnum[] | string[]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  useEffect(() => {
    console.log("Filters changed: ", filters);
  }, [filters]);
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
          value={isLive}
          onChange={setLive}
          size="large"
          shape="round"
        />

        <Button color="primary" variant="outlined">
          <PlusCircleOutlined />
          Movimiento
        </Button>
      </div>

      <Card title="Filtros" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle" justify="center">
          <Col>
            <Input
              placeholder="Buscar..."
              value={filters.description ?? ""}
              onChange={(e) =>
                handleFilterChange("description", e.target.value)
              }
              style={{ width: 200 }}
            />
          </Col>
          <Col>
            <Select
              mode="multiple"
              value={filters.type}
              onChange={(val) => handleFilterChange("type", val as TypeEnum[])}
              style={{ width: 200 }}
              placeholder="Todos los Tipos"
              allowClear
            >
              {Object.values(TypeEnum).map((type) => (
                <Option key={type} value={type}>
                  {capitalize(type)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              mode="multiple"
              value={filters.bank}
              onChange={(val) => handleFilterChange("bank", val as BankEnum[])}
              style={{ width: 200 }}
              placeholder="Todos los bancos"
              allowClear
            >
              {Object.values(BankEnum).map((bank) => (
                <Option key={bank} value={bank}>
                  {capitalize(bank)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              mode="multiple"
              value={filters.categories}
              onChange={(val) =>
                handleFilterChange("categories", val as string[])
              }
              style={{ width: 200 }}
              placeholder="Todos los Categorías"
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.description}>
                  {cat.description}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
      <Card title="Movimientos" style={{ marginBottom: 16, padding: 0 }}>
        <MovementTable filters={filters}></MovementTable>
      </Card>
    </div>
  );
}
