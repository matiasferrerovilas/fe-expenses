import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Row, Typography } from "antd";
import { getServicesApi, payServiceApi } from "../apis/ServiceApi";
import { useMemo } from "react";
import { ServiceCard } from "../components/services/ServiceCard";
import type { Service } from "../models/Service";

export const Route = createFileRoute("/services")({
  component: RouteComponent,
});
const SERVICE_KEY = ["service-history"] as const;
const { Title, Text } = Typography;

const createServiceFactoryQuery = () =>
  queryOptions({
    queryKey: [SERVICE_KEY],
    queryFn: () => getServicesApi(),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

function RouteComponent() {
  const queryConfig = useMemo(() => createServiceFactoryQuery(), []);
  const { data, isFetching } = useQuery(queryConfig);
  const queryClient = useQueryClient();

  const unpaidServices = data?.filter((service) => !service.isPaid) || [];
  const paidServices = data?.filter((service) => service.isPaid) || [];

  const uploadMutation = useMutation({
    mutationFn: ({ service }: { service: Service }) => payServiceApi(service),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEY,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
    },
  });

  const handleUpdateService = (service: Service) => {
    uploadMutation.mutate({ service });
  };
  return (
    <div
      style={{
        display: "grid",
        paddingTop: "16px",
        gridTemplateRows: "auto 1fr",
        gap: "16px",
        height: "100%",
        width: "100%",
      }}
    >
      <Row gutter={16} style={{ padding: "2%" }}>
        <Col span={8}>
          <Card
            loading={isFetching}
            title="Total Servicios"
            style={{ textAlign: "center" }}
          >
            <Title level={2} style={{ margin: 0 }}>
              {data?.length ?? 0}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Servicios Registrados
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            loading={isFetching}
            title="Pagados"
            style={{ textAlign: "center" }}
          >
            <Title level={2} style={{ margin: 0 }}>
              $
              {data
                ?.filter((service) => service.isPaid)
                .reduce((acc, m) => acc + (m.amount || 0), 0)
                .toFixed(2) ?? 0}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {paidServices.length} Servicios al día
            </Text>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            loading={isFetching}
            title="Pendientes"
            style={{ textAlign: "center" }}
          >
            <Title level={2} style={{ margin: 0 }}>
              $
              {unpaidServices
                .reduce((acc, m) => acc + (m.amount || 0), 0)
                .toFixed(2) ?? 0}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {unpaidServices.length} Servicios pendientes
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {data?.map((service) => (
          <Col span={8}>
            <ServiceCard
              service={service}
              handleUpdateService={handleUpdateService}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
