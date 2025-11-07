import React, { useMemo } from "react";
import { Table, Tag, Typography } from "antd";
import {
  DeleteOutlined,
  DeleteTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import type { Movement } from "../../../models/Movement";
import type { MovementFilters } from "../../../routes/movement";
import { useMovement } from "../../../apis/hooks/useMovement";
import { usePagination } from "../../../apis/hooks/usePagination";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { TypeEnum } from "../../../enums/TypeExpense";
import { useMovementSubscription } from "../../../apis/websocket/useMovementSubscription";
import { useMutation } from "@tanstack/react-query";
import { deleteExpenseApi } from "../../../apis/ExpenseApi";
const { Text } = Typography;

const DEFAULT_PAGE_SIZE = 25;

interface MovementTableProps {
  filters: MovementFilters;
}

const capitalizeFirst = (text?: string): string => {
  if (!text) return "-";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

interface FormattedMovement extends Movement {
  formattedDate: string;
  bankName: React.ReactNode;
  groupName: React.ReactNode;
  typeName: React.ReactNode;
  categoryName: React.ReactNode;
  currencySymbol: React.ReactNode;
  installments: string;
  isDebit: boolean;
  amountColor: string;
  amountSign: string;
}

function MovementTable({ filters }: MovementTableProps) {
  const { page, nextPage, prevPage, canGoPrev } = usePagination();
  useMovementSubscription();

  const uploadMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteExpenseApi(id);
    },
    onSuccess: () => {
      console.log("✅ Movimiento eliminado correctamente");
    },
    onError: (err) => {
      console.error("❌ Error eliminado el movimiento", err);
    },
  });

  const {
    data: movements = { content: [], totalElements: 0, totalPages: 0 },
    isFetching,
  } = useMovement(filters, page, DEFAULT_PAGE_SIZE);

  const handleDelete = (id: number) => {
    uploadMutation.mutate(id);
  };
  const formattedMovements = useMemo<FormattedMovement[]>(() => {
    return movements.content.map((m) => {
      const isDebit = m.type === TypeEnum.DEBITO || m.type === TypeEnum.CREDITO;

      return {
        ...m,
        formattedDate: dayjs(m.date).format("DD/MM/YYYY"),
        bankName: <Tag color="magenta">{capitalizeFirst(m.bank)}</Tag>,
        groupName: (
          <Tag color="magenta">
            {capitalizeFirst(m.userGroups?.description)}
          </Tag>
        ),
        typeName: <Tag color="green">{capitalizeFirst(m.type)}</Tag>,
        categoryName: (
          <Tag color="success">{capitalizeFirst(m.category?.description)}</Tag>
        ),
        currencySymbol: <Tag color="blue">{m.currency?.symbol || "-"}</Tag>,
        installments: m.cuotasTotales
          ? `${m.cuotaActual ?? "-"}/${m.cuotasTotales}`
          : "-",
        isDebit,
        amountColor: isDebit ? "red" : "green",
        amountSign: isDebit ? "-" : "+",
      };
    });
  }, [movements.content]);

  const columns = useMemo<ColumnsType<FormattedMovement>>(
    () => [
      {
        title: "Fecha",
        dataIndex: "formattedDate",
        key: "date",
        align: "left",
      },
      { title: "Banco", dataIndex: "bankName", key: "bank", align: "left" },
      {
        title: "Grupo",
        dataIndex: "groupName",
        key: "userGroups",
        align: "left",
      },
      { title: "Tarjeta", dataIndex: "typeName", key: "type" },
      {
        title: "Categoria",
        dataIndex: "categoryName",
        key: "category",
        align: "center",
      },
      {
        title: "Moneda",
        dataIndex: "currencySymbol",
        key: "currency",
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
        render: (_: unknown, record) => (
          <Text style={{ color: record.amountColor }}>
            {`${record.amountSign} $${Math.abs(record.amount).toFixed(2)}`}
          </Text>
        ),
      },
      {
        title: "",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <DeleteTwoTone
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={() => handleDelete(record.id)}
          />
        ),
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
