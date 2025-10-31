import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Spin, Table, Tag, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { Movement } from "../../../models/Expense";
import type { MovementFilters } from "../../../routes/movement";
import { useWebSocket } from "../../../apis/websocket/WebSocketProvider";
import type { PageResponse } from "../../../models/BaseMode";
import { useMovement } from "../../../apis/hooks/useMovement";
import { usePagination } from "../../../apis/hooks/usePagination";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { TypeEnum } from "../../../enums/TypeExpense";
const { Text } = Typography;

const EXPENSES_QUERY_KEY = "movement-history" as const;
const DEFAULT_PAGE_SIZE = 25;

interface MovementTableProps {
  filters: MovementFilters;
}

function MovementTable({ filters }: MovementTableProps) {
  const queryClient = useQueryClient();
  const ws = useWebSocket();
  const { page } = usePagination();

  const { data: movements, isFetching } = useMovement(
    filters,
    page,
    DEFAULT_PAGE_SIZE
  );

  useEffect(() => {
    const callback = (payload: Movement) => {
      queryClient.setQueryData(
        [EXPENSES_QUERY_KEY, page, filters],
        (old?: PageResponse<Movement>) => {
          if (!old) return { content: [payload], size: DEFAULT_PAGE_SIZE };
          const exists = old.content.some((s) => s.id === payload.id);
          let content = exists
            ? old.content.map((s) => (s.id === payload.id ? payload : s))
            : [payload, ...old.content];

          if (content.length > DEFAULT_PAGE_SIZE)
            content = content.slice(0, DEFAULT_PAGE_SIZE);

          return {
            ...old,
            content,
            totalElements: content.length,
            totalPages: Math.ceil(
              content.length / (old.size ?? DEFAULT_PAGE_SIZE)
            ),
          };
        }
      );
    };

    ws.subscribe("/topic/movimientos/new", callback);
    return () => ws.unsubscribe("/topic/movimientos/new", callback);
  }, [ws, queryClient, page, filters]);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      width: "2%",
      align: "left",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Banco",
      dataIndex: "bank",
      inputType: "bank",
      key: "bank",
      width: "2%",
      align: "left",
      render: (_: unknown, record: Movement) => (
        <Tag color="magenta">
          {record.bank
            ? record.bank.charAt(0).toUpperCase() +
              record.bank.slice(1).toLowerCase()
            : "-"}
        </Tag>
      ),
    },
    {
      title: "Grupo",
      dataIndex: "userGroups",
      inputType: "userGroups",
      key: "userGroups",
      width: "2%",
      align: "left",
      render: (_: unknown, record: Movement) => (
        <Tag color="magenta">
          {record.userGroups
            ? record.userGroups.description.charAt(0).toUpperCase() +
              record.userGroups.description.slice(1).toLowerCase()
            : "-"}
        </Tag>
      ),
    },
    {
      title: "Tarjeta",
      dataIndex: "type",
      key: "type",
      width: "2%",
      render: (_: unknown, record: Movement) => (
        <Tag color="green">
          {record.type
            ? record.type.charAt(0).toUpperCase() +
              record.type.slice(1).toLowerCase()
            : "-"}
        </Tag>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
      width: "5%",
      render: (_: unknown, record: Movement) => (
        <Tag color="success">
          {record.category?.description
            ? record.category.description.charAt(0).toUpperCase() +
              record.category.description.slice(1).toLowerCase()
            : "-"}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Moneda",
      dataIndex: "currency",
      key: "currency",
      width: "5%",
      render: (_: unknown, record: Movement) => (
        <Tag color="blue">
          {record.currency?.symbol ? record.currency.symbol : "-"}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Descripcion",
      dataIndex: "description",
      key: "description",
      width: "8%",
      align: "left",
    },
    {
      title: "Cuotas",
      dataIndex: "cuotasTotales",
      key: "cuotasTotales",
      width: "7%",
      align: "right",
      render: (_: unknown, record: Movement) => {
        if (!record.cuotasTotales) return "-";
        const actual = record.cuotaActual ?? "-";
        const total = record.cuotasTotales ?? "-";
        return `${actual}/${total}`;
      },
    },
    {
      title: "Dinero",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (amount: number, record: Movement) => {
        const isDebit =
          record.type === TypeEnum.DEBITO || record.type === TypeEnum.CREDITO;
        const color = isDebit ? "red" : "green";
        const sign = isDebit ? "-" : "+";

        return (
          <Text style={{ color }}>
            {`${sign} $${Math.abs(amount).toFixed(2)}`}
          </Text>
        );
      },
    },
    { title: "Id", dataIndex: "id", key: "id", width: "1%", align: "right" },
  ] as ColumnsType<Movement>;

  if (isFetching)
    return (
      <div className="flex justify-center items-center h-[80vh] w-full">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 120 }} spin />}
          size="large"
        />
      </div>
    );
  return (
    <Table<Movement>
      rowKey="id"
      dataSource={movements.content}
      columns={columns}
      size="small"
      bordered
    />
  );
}

export default React.memo(MovementTable);
