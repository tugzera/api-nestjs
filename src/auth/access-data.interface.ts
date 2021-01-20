import { JwtPayload } from './jwt-payload.interface';

export interface AccessData {
  token: string;
  data: JwtPayload;
}
