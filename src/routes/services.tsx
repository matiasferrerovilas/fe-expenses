import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Row, Typography } from "antd";
import {
  addServiceApi,
  payServiceApi,
  type ServiceToAdd,
} from "../apis/ServiceApi";
import { ServiceCard } from "../components/services/ServiceCard";
import type { Service } from "../models/Service";
import { ServiceCardForm } from "../components/services/ServiceCardForm";
import { useService } from "../apis/hooks/useService";
import { useServiceSubscription } from "../apis/websocket/useServiceSubscription";
import { ServiceSummary } from "../components/services/ServiceSummary";

export const Route = createFileRoute("/services")({
  component: RouteComponent,
});
const { Title, Text } = Typography;

function RouteComponent() {
  const { data: services = [], isFetching } = useService();

  const unpaidServices = services?.filter((service) => !service.isPaid) || [];
  const paidServices = services?.filter((service) => service.isPaid) || [];

  useServiceSubscription();

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
      <ServiceSummary services={services} isFetching={isFetching} />

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
