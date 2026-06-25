export interface OutboxFilterParams {
  keyword?: string;
  counterpartCode?: string;
  status?: string;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export interface CreateOutboxPayload {
  documentCode: string;
  title: string;
  receiverInteropCode: string;
  fileReference: string;
  note?: string;
}
