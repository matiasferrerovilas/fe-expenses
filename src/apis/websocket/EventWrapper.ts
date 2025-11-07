export interface EventWrapper<T> {
  eventType: EventType;
  message: T;
}

export const EventType = {
  MOVEMENT_ADDED: "MOVEMENT_ADDED",
  MOVEMENT_DELETED: "MOVEMENT_DELETED",
  SERVICE_PAID: "SERVICE_PAID RIO",
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];
