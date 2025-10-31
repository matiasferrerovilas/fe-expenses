import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Row, Typography } from "antd";
import {
  addServiceApi,
  getServicesApi,
  payServiceApi,
  type ServiceToAdd,
} from "../apis/ServiceApi";
import { useEffect, useMemo } from "react";
import { ServiceCard } from "../components/services/ServiceCard";
import type { Service } from "../models/Service";
import { useWebSocket } from "../apis/websocket/WebSocketProvider";
import { ServiceCardForm } from "../components/services/ServiceCardForm";

export const Route = createFileRoute("/services")({
  component: RouteComponent,
});
const SERVICE_KEY = ["service-history"] as const;
const { Title, Text } = Typography;

const createServiceFactoryQuery = () =>
  queryOptions({
    queryKey: SERVICE_KEY,
    queryFn: () => getServicesApi(),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

function RouteComponent() {
  const queryConfig = useMemo(() => createServiceFactoryQuery(), []);
  const { data: services = [], isFetching } = useQuery(queryConfig);
  const queryClient = useQueryClient();

  const unpaidServices = services?.filter((service) => !service.isPaid) || [];
  const paidServices = services?.filter((service) => service.isPaid) || [];

  const ws = useWebSocket();

  useEffect(() => {
    const callback = (payload: Service) => {
      queryClient.setQueryData(SERVICE_KEY, (oldData?: Service[]) => {
        if (!oldData) return [payload];

        const exists = oldData.some((s) => s.id === payload.id);
        if (exists) {
          return oldData.map((s) => (s.id === payload.id ? payload : s));
        }
        return [...oldData, payload];
      });
    };
    ws.subscribe("/topic/servicios/update", callback);
    ws.subscribe("/topic/servicios/new", callback);

    return () => ws.unsubscribe("/topic/gastos", callback);
  }, [ws]);

  const uploadMutation = useMutation({
    mutationFn: ({ service }: { service: Service }) => payServiceApi(service),
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
    },
  });
  const addServiceMutation = useMutation({
    mutationFn: ({ service }: { service: ServiceToAdd }) =>
      addServiceApi(service),
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
    },
  });

  const handleUpdateService = (service: Service) => {
    uploadMutation.mutate({ service });
  };
  const handleAddService = (service: ServiceToAdd) => {
    addServiceMutation.mutate({ service });
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
              {services?.length ?? 0}
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
              {services
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
        <Col span={8}>
          <ServiceCardForm handleAddService={handleAddService} />
        </Col>
        {services?.map((service) => (
          <Col span={8} key={service.id}>
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
