import { useState, useEffect, useOptimistic } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

import { useAppDispatch, useAppSelector } from "./redux-toolkit";

import { ManagerRole } from "@/settings/enums";
import { setUserInfo } from "@/features/auth/slice";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

const useRoles = () => {
  const dispatch = useAppDispatch();
  const [role, setRole] = useState<ManagerRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [optimisticRole, setOptimisticRole] = useOptimistic<ManagerRole | null>(
    role,
  );

  const { access_token: token } = useAppSelector((state) => state.auth);
  const isAdmin = optimisticRole === ManagerRole.admin;
  const isSupervision = optimisticRole === ManagerRole.supervision;
  const isManager = optimisticRole === ManagerRole.manager;
  const isLoading = role === null;

  useEffect(() => {
    if (!token) {
      setRole(null);

      return;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token) ?? {};
      const newRole = decoded?.role as ManagerRole;
      const id = decoded?.userId;

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        setRole(null);
        setUserId(null);
        dispatch(setUserInfo(null));
      } else {
        setUserId(id);
        setOptimisticRole(newRole);
        setRole(newRole);
      }
    } catch (error) {
      setRole(null);
    }
  }, [token]);

  return { isAdmin, isSupervision, isManager, role, isLoading, userId };
};

export default useRoles;
