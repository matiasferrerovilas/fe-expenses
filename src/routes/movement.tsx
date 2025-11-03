import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, Input, Row, Segmented, Select } from "antd";
import { useCallback, useState } from "react";
import { BankEnum } from "../enums/BankEnum";
import { TypeEnum } from "../enums/TypeExpense";
import MovementTable from "../components/movements/tables/MovementTable";
import {
  HistoryOutlined,
  PlusCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { CurrencyEnum } from "../enums/CurrencyEnum";
import AddEditMovementModal from "../components/modals/movements/AddEditMovementModal";
import { useCategory } from "../apis/hooks/useCategory";

const { Option } = Select;

export const Route = createFileRoute("/movement")({
  component: RouteComponent,
});
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

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
  const [modalOpen, setModalOpen] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const { data: categories = [] } = useCategory();

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

        <Button
          color="primary"
          variant="outlined"
          onClick={() => setModalOpen(true)}
        >
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
              value={filters.currency}
              onChange={(val) =>
                handleFilterChange("currency", val as CurrencyEnum[])
              }
              style={{ width: 200 }}
              placeholder="Todas las monedas"
              allowClear
            >
              {Object.values(CurrencyEnum).map((currency) => (
                <Option key={currency} value={currency}>
                  {capitalize(currency)}
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
        <MovementTable filters={filters} />
      </Card>
      {modalOpen && (
        <AddEditMovementModal
          modalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
