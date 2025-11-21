import { Card, Col, Space, Typography } from "antd";

const { Text, Title } = Typography;

interface BalanceCardProps {
  title: string;
  amount: number;
  color: string;
  icon: React.ReactNode;
  subtitle: string;
  isFetching: boolean;
}
export default function BalanceCard({
  title,
  amount,
  color,
  icon,
  subtitle,
  isFetching,
}: BalanceCardProps) {
  return (
    <Col xs={24} sm={12} lg={8}>
      <Card
        loading={isFetching}
        style={{
          borderRadius: 16,
          height: "100%",
        }}
      >
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text strong>{title}</Text>
            <span style={{ fontSize: 18 }}>{icon}</span>
          </Space>

          {!isFetching && (
            <Title level={3} style={{ color, margin: 0 }}>
              ${amount.toLocaleString("es-AR")}
            </Title>
          )}

          <Text type="secondary">{subtitle}</Text>
        </Space>
      </Card>
    </Col>
  );
}
