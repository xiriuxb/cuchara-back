export interface ClerkUserCreatedEvent {
  id: string;
  email_addresses: { email_address: string }[];
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  created_at?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClerkUserUpdatedEvent extends ClerkUserCreatedEvent {}

export interface ClerkUserDeletedEvent {
  id: string;
}
