import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Col, Row } from "antd";
import {
  addServiceApi,
  payServiceApi,
  updateServiceApi,
  type ServiceToAdd,
} from "../apis/ServiceApi";
import { ServiceCard } from "../components/services/ServiceCard";
import type { Service, ServiceToUpdate } from "../models/Service";
import { ServiceCardForm } from "../components/services/ServiceCardForm";
import { useService } from "../apis/hooks/useService";
import { useServiceSubscription } from "../apis/websocket/useServiceSubscription";
import { ServiceSummary } from "../components/services/ServiceSummary";

export const Route = createFileRoute("/services")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: services = [], isFetching } = useService();

  useServiceSubscription();

  const payMutation = useMutation({
    mutationFn: ({ service }: { service: Service }) => payServiceApi(service),
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
    },
  });
  const updateServiceMutation = useMutation({
    mutationFn: ({ service }: { service: ServiceToUpdate }) =>
      updateServiceApi(service),
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

  const handlePayServiceMutation = (service: Service) => {
    payMutation.mutate({ service });
  };
  const handleUpdateServiceMutation = (service: ServiceToUpdate) => {
    updateServiceMutation.mutate({ service });
  };
  const handleAddService = (service: ServiceToAdd) => {
    addServiceMutation.mutate({ service });
  };
  return (
    <div>
      <ServiceSummary services={services} isFetching={isFetching} />
      <Row gutter={16} style={{ marginBottom: 16, padding: 0 }}>
        <Col span={8} style={{ marginBottom: 16 }}>
          <ServiceCardForm handleAddService={handleAddService} />
        </Col>
        {services?.map((service) => (
          <Col span={8} key={service.id} style={{ marginBottom: 16 }}>
            <ServiceCard
              service={service}
              handlePayServiceMutation={handlePayServiceMutation}
              handleUpdateServiceMutation={handleUpdateServiceMutation}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
