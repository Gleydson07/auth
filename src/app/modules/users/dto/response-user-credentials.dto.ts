export class ResponseUserCredentialsDto {
  provisionalPassword: string;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
}
