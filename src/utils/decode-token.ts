import { jwtDecode, JwtPayload } from "jwt-decode";
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const decodeToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded: CustomJwtPayload = jwtDecode(token);

    return decoded;
  } catch (error) {
    return null;
  }
};
