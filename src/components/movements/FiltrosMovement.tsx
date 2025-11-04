import { Card, Col, Input, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { MovementFilters } from "../../routes/movement";
import { BankEnum } from "../../enums/BankEnum";
import { TypeEnum } from "../../enums/TypeExpense";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { useCategory } from "../../apis/hooks/useCategory";

const { Option } = Select;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

interface Props {
  onFiltersChange: (filters: MovementFilters) => void;
  initialFilters: MovementFilters;
}

export default function FiltrosMovement({
  onFiltersChange,
  initialFilters,
}: Props) {
  const { data: categories = [] } = useCategory();
  const [filters, setFilters] = useState<MovementFilters>(initialFilters);

  const handleChange = useCallback(
    (
      key: keyof MovementFilters,
      value: string | boolean | null | BankEnum[] | TypeEnum[] | string[]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <Card title="Filtros" style={{ marginBottom: 16 }}>
      <Row gutter={16} align="middle" justify="center">
        <Col>
          <Input
            placeholder="Buscar..."
            value={filters.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            mode="multiple"
            value={filters.type}
            onChange={(val) => handleChange("type", val as TypeEnum[])}
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
            onChange={(val) => handleChange("bank", val as BankEnum[])}
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
            onChange={(val) => handleChange("currency", val as CurrencyEnum[])}
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
            onChange={(val) => handleChange("categories", val as string[])}
            style={{ width: 200 }}
            placeholder="Todas las Categorías"
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
  );
}
