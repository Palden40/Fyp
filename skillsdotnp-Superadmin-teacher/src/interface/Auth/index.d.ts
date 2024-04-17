interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}
interface LoginRes {
  message: string;
  token: string;
}
