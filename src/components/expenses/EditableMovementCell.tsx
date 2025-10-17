import { Form, Input, InputNumber, Select } from "antd";
import React, { useMemo } from "react";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../apis/CategoryApi";
import { TypeEnum } from "../../enums/TypeExpense";
import { BankEnum } from "../../enums/BankEnum";

interface EditableMovementCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text" | "bank" | "currency" | "category" | "type";
  record: any;
  index: number;
  children: React.ReactNode;
}

const CATEGORIES_QUERY_KEY = ["categories"] as const;

const createCategoryFactoryQuery = () =>
  queryOptions({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => getCategoriesApi(),
    staleTime: 5 * 60 * 1000,
  });

const INPUT_STYLE = {
  width: "100%",
  fontSize: "12px",
  padding: "2px 5px",
} as const;

const SELECT_STYLES = {
  popup: {
    root: {
      fontSize: "12px",
      padding: "2px 5px",
      textAlign: "center" as const,
    },
  },
} as const;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const createInputComponents = (title: any, categories: any[]) => ({
  number: () => (
    <InputNumber controls={false} size="small" style={{ width: "100%" }} />
  ),

  text: () => <Input style={INPUT_STYLE} />,

  bank: () => (
    <Select
      placeholder={`Seleccionar ${title}`}
      size="small"
      styles={SELECT_STYLES}
    >
      {Object.values(BankEnum).map((bank) => (
        <Select.Option key={bank} value={bank}>
          {capitalize(bank)}
        </Select.Option>
      ))}
    </Select>
  ),

  type: () => (
    <Select
      placeholder={`Seleccionar ${title}`}
      size="small"
      styles={SELECT_STYLES}
    >
      {Object.values(TypeEnum).map((type) => (
        <Select.Option key={type} value={type}>
          {capitalize(type)}
        </Select.Option>
      ))}
    </Select>
  ),

  currency: () => (
    <Select
      placeholder={`Seleccionar ${title}`}
      size="small"
      styles={SELECT_STYLES}
    >
      {Object.values(CurrencyEnum).map((currency) => (
        <Select.Option key={currency} value={currency} style={INPUT_STYLE}>
          {currency}
        </Select.Option>
      ))}
    </Select>
  ),

  category: () => (
    <Select
      placeholder={`Seleccionar ${title}`}
      showSearch
      size="small"
      styles={SELECT_STYLES}
    >
      {categories.map((cat) => (
        <Select.Option key={cat.id} value={cat.description} style={INPUT_STYLE}>
          {cat.description}
        </Select.Option>
      ))}
    </Select>
  ),
});

export default function EditableMovementCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: EditableMovementCellProps) {
  const queryConfig = useMemo(() => createCategoryFactoryQuery(), []);
  const { data: categories = [] } = useSuspenseQuery(queryConfig);

  const inputComponents = useMemo(
    () => createInputComponents(title, Object.values(categories)),
    [record, dataIndex, title, categories]
  );

  const inputNode = inputComponents[inputType]?.() ?? (
    <Input style={INPUT_STYLE} />
  );

  return (
    <td {...restProps}>
      {editing && inputType ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            ...(inputType === "number"
              ? [{ required: true, message: `Ingrese ${title}` }]
              : []),
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
