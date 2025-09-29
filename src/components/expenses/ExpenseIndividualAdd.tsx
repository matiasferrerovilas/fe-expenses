import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tabs,
} from "antd";
import type { CreateExpenseForm } from "../../routes/expenses/live";
import { BankEnum } from "../../enums/BankEnum";
import { TypeEnum } from "../../enums/TypeExpense";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../apis/CategoryApi";
import { useMemo } from "react";
import dayjs from "dayjs";
import ExpenseTab from "./tabs/ExpenseTab";
import TabPane from "antd/es/tabs/TabPane";
import IngresoTab from "./tabs/IngresoTab";

const CATEGORIES_QUERY_KEY = ["categories"] as const;

const createCategoryFactoryQuery = () =>
  queryOptions({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => getCategoriesApi(),
    staleTime: 5 * 60 * 1000,
  });
interface ExpenseIndividualAddProps {
  onSubmit: (values: CreateExpenseForm) => void;
}

export default function ExpenseIndividualAdd({
  onSubmit,
}: ExpenseIndividualAddProps) {
  const queryConfig = useMemo(() => createCategoryFactoryQuery(), []);

  const { data } = useSuspenseQuery(queryConfig);

  return (
    <Row
      gutter={[6, 8]}
      style={{
        height: "80vh",
        width: "80%",
        margin: "0 auto",
        alignItems: "center",
        justifySelf: "center",
        justifyContent: "center",
        backgroundColor: "white",
        border: "3px dashed #1890ff",
        borderRadius: "8px",
      }}
    >
      <Col>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Tab 1" key="1">
            <ExpenseTab onSubmit={onSubmit} categories={data} />
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <IngresoTab onSubmit={onSubmit} categories={data} />
          </TabPane>
        </Tabs>
        ,
      </Col>
    </Row>
  );
}
