import { Card, Col, Input, Row, Select } from "antd";
import { TypeEnum } from "../../enums/TypeExpense";
import { BankEnum } from "../../enums/BankEnum";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { useCategory } from "../../apis/hooks/useCategory";
import { useCallback } from "react";
import type { MovementFilters } from "../../routes/movement";
const { Option } = Select;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

interface FiltersMovementProps {
  filters: MovementFilters;
  onChange: (
    key: keyof MovementFilters,
    value: string | boolean | null | BankEnum[] | TypeEnum[] | string[]
  ) => void;
}
export default function FiltrosMovement({
  filters,
  onChange,
}: FiltersMovementProps) {
  const { data: categories = [] } = useCategory();

  const handleFilterChange = useCallback(
    (
      key: keyof MovementFilters,
      value: string | boolean | null | BankEnum[] | TypeEnum[] | string[]
    ) => onChange(key, value),
    [onChange]
  );

  return (
    <Card title="Filtros" style={{ marginBottom: 16 }}>
      <Row gutter={16} align="middle" justify="center">
        <Col>
          <Input
            placeholder="Buscar..."
            value={filters.description ?? ""}
            onChange={(e) => handleFilterChange("description", e.target.value)}
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
  );
}
