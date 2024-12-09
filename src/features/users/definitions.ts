import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export const usersStatus = [
  {
    value: "active",
    label: "Hoạt động",
    icon: CheckCircledIcon,
  },
  {
    value: "inactive",
    label: "Tạm dừng",
    icon: CrossCircledIcon,
  },
];

export const usersRole = [
  {
    value: "client",
    label: "Khách hàng",
  },
  {
    value: "provider",
    label: "Nhà cung cấp",
  },
];
