import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { Table, Tag, Typography } from "antd";
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

// Helper para capitalizar
const capitalizeFirst = (text?: string): string => {
  if (!text) return "-";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Tipo extendido con datos preprocesados
interface FormattedMovement extends Movement {
  formattedDate: string;
  bankName: string;
  groupName: string;
  typeName: string;
  categoryName: string;
  currencySymbol: string;
  installments: string;
  isDebit: boolean;
  amountColor: string;
  amountSign: string;
}

function MovementTable({ filters }: MovementTableProps) {
  const queryClient = useQueryClient();
  const ws = useWebSocket();
  const { page, nextPage, prevPage, canGoPrev } = usePagination();

  const {
    data: movements = { content: [], totalElements: 0, totalPages: 0 },
    isFetching,
  } = useMovement(filters, page, DEFAULT_PAGE_SIZE);

  const formattedMovements = useMemo<FormattedMovement[]>(() => {
    return movements.content.map((m) => {
      const isDebit = m.type === TypeEnum.DEBITO || m.type === TypeEnum.CREDITO;

      return {
        ...m,
        formattedDate: dayjs(m.date).format("DD/MM/YYYY"),
        bankName: capitalizeFirst(m.bank),
        groupName: capitalizeFirst(m.userGroups?.description),
        typeName: capitalizeFirst(m.type),
        categoryName: capitalizeFirst(m.category?.description),
        currencySymbol: m.currency?.symbol || "-",
        installments: m.cuotasTotales
          ? `${m.cuotaActual ?? "-"}/${m.cuotasTotales}`
          : "-",
        isDebit,
        amountColor: isDebit ? "red" : "green",
        amountSign: isDebit ? "-" : "+",
      };
    });
  }, [movements.content]);

  useEffect(() => {
    const callback = (payload: Movement) => {
      queryClient.setQueryData(
        [EXPENSES_QUERY_KEY, page, filters],
        (old?: PageResponse<Movement>) => {
          if (!old)
            return {
              content: [payload],
              size: DEFAULT_PAGE_SIZE,
              totalElements: 1,
              totalPages: 1,
            };

          const existingIndex = old.content.findIndex(
            (s) => s.id === payload.id
          );

          let content: Movement[];
          if (existingIndex !== -1) {
            content = [
              ...old.content.slice(0, existingIndex),
              payload,
              ...old.content.slice(existingIndex + 1),
            ];
          } else {
            content = [payload, ...old.content].slice(0, DEFAULT_PAGE_SIZE);
          }

          return {
            ...old,
            content,
            totalElements: old.totalElements + (existingIndex === -1 ? 1 : 0),
            totalPages: Math.ceil(
              (old.totalElements + (existingIndex === -1 ? 1 : 0)) /
                DEFAULT_PAGE_SIZE
            ),
          };
        }
      );
    };

    ws.subscribe("/topic/movimientos/new", callback);
    return () => ws.unsubscribe("/topic/movimientos/new", callback);
  }, [ws, queryClient, page, filters]);

  // Columnas simplificadas - solo renderizado simple
  const columns = useMemo<ColumnsType<FormattedMovement>>(
    () => [
      {
        title: "Fecha",
        dataIndex: "formattedDate",
        key: "date",
        align: "left",
      },
      {
        title: "Banco",
        dataIndex: "bankName",
        key: "bank",
        align: "left",
        render: (text: string) => <Tag color="magenta">{text}</Tag>,
      },
      {
        title: "Grupo",
        dataIndex: "groupName",
        key: "userGroups",
        align: "left",
        render: (text: string) => <Tag color="magenta">{text}</Tag>,
      },
      {
        title: "Tarjeta",
        dataIndex: "typeName",
        key: "type",
        render: (text: string) => <Tag color="green">{text}</Tag>,
      },
      {
        title: "Categoria",
        dataIndex: "categoryName",
        key: "category",
        render: (text: string) => <Tag color="success">{text}</Tag>,
        align: "center",
      },
      {
        title: "Moneda",
        dataIndex: "currencySymbol",
        key: "currency",
        render: (text: string) => <Tag color="blue">{text}</Tag>,
        align: "center",
      },
      {
        title: "Descripcion",
        dataIndex: "description",
        key: "description",
        align: "left",
      },
      {
        title: "Cuotas",
        dataIndex: "installments",
        key: "cuotasTotales",
        align: "right",
      },
      {
        title: "Dinero",
        dataIndex: "amount",
        key: "amount",
        render: (_: unknown, record: FormattedMovement) => (
          <Text style={{ color: record.amountColor }}>
            {`${record.amountSign} $${Math.abs(record.amount).toFixed(2)}`}
          </Text>
        ),
      },
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        align: "right",
      },
    ],
    []
  );

  const loadingConfig = useMemo(
    () => ({
      spinning: isFetching,
      indicator: <LoadingOutlined style={{ fontSize: 80 }} spin />,
    }),
    [isFetching]
  );

  const paginationConfig = useMemo(
    () => ({
      showSizeChanger: false,
      defaultPageSize: DEFAULT_PAGE_SIZE,
      total: movements?.totalElements || 0,
      current: page + 1,
      onChange: (p: number) => {
        if (p - 1 > page) nextPage();
        else if (p - 1 < page && canGoPrev) prevPage();
      },
    }),
    [movements?.totalElements, page, nextPage, prevPage, canGoPrev]
  );

  return (
    <Table<FormattedMovement>
      rowKey="id"
      dataSource={formattedMovements}
      columns={columns}
      size="small"
      bordered
      loading={loadingConfig}
      pagination={paginationConfig}
    />
  );
}

export default React.memo(MovementTable);
