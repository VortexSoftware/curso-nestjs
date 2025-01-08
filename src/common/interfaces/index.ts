export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
  style?: object;
}
