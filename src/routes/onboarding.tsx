import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Col, Row, Steps, Typography } from "antd";
import IngresoOnBoarding from "../components/onboarding/IngresoOnBoarding";
import GrupoOnboarding from "../components/onboarding/GrupoOnboarding";
import {
  finishOnboarding,
  type OnboardingForm,
} from "../apis/onboarding/OnBoarding";
import { useMutation } from "@tanstack/react-query";

const { Title, Text } = Typography;

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingForm>>({});

  const handleNext = (values: Partial<OnboardingForm>) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const finishMutation = useMutation({
    mutationFn: (onboardinForm: OnboardingForm) => {
      return finishOnboarding(onboardinForm);
    },
    onSuccess: () => {
      console.debug("✅ Movimiento cargado correctamente");
    },
    onError: (err) => {
      console.error("❌ Error cargando el movimiento", err);
    },
  });

  const steps = [
    {
      title: "Grupos",
      content: <GrupoOnboarding initialValues={formData} onNext={handleNext} />,
    },
    {
      title: "Ingresos",
      content: (
        <IngresoOnBoarding
          initialValues={formData}
          onPrev={handlePrev}
          onNext={(values) => {
            const selectedGroup = values.groups;
            const newGroups = (formData.groups || []).filter(
              (g: string) => g && g.trim()
            );
            const finalData: OnboardingForm = {
              ...values,
              groups: newGroups,
              onBoardingAmount: {
                amount: values.amount,
                group: selectedGroup,
              },
            };
            setFormData(finalData);
            console.log("Final Onboarding Data:", finalData);
            finishMutation.mutate(finalData);
          }}
        />
      ),
    },
  ];

  return (
    <Row justify="center">
      <Col xs={24} sm={18} md={14} lg={15}>
        <Card style={{ margin: 20, paddingInline: 20, maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Title level={1}>Bienvenido!</Title>
            <Text type="secondary">
              Antes de comenzar configuremos tu cuenta
            </Text>
          </div>

          <Steps
            current={currentStep}
            items={steps.map((s) => ({ title: s.title }))}
            style={{ marginBottom: 40 }}
          />

          {steps[currentStep].content}
        </Card>
      </Col>
    </Row>
  );
}
