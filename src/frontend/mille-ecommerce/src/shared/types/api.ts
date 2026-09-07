export type ApiResponse<TResponse> = {
  isSuccess: boolean;
  message: string;
  data: TResponse | null;
  errors: unknown;
  timeStamp: string;
};
