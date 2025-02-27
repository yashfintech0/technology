export const BASE_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:6001"
    : process.env.NEXT_PUBLIC_BACKEND_URL;
