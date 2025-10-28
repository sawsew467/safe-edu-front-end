"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Phone,
  Mail,
  User,
  Globe,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import {
  useGetEmergencyContactsQuery,
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  EmergencyContact,
} from "../emergency-contact.api";
import { EMERGENCY_CONTACT_ROLES } from "../emergency-contact.data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import CardList from "@/components/ui/data-card";

interface EmergencyContactManagerProps {
  isGlobal?: boolean; // true for admin (global), false for organization
}

export function EmergencyContactManager({
  isGlobal = false,
}: EmergencyContactManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const { contacts, isFetching } = useGetEmergencyContactsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      contacts: data?.data?.data ?? [],
      ...rest,
    }),
  });
  const [createContact, { isLoading: isCreating }] =
    useCreateEmergencyContactMutation();
  const [updateContact, { isLoading: isUpdating }] =
    useUpdateEmergencyContactMutation();
  const [deleteContact, { isLoading: isDeleting }] =
    useDeleteEmergencyContactMutation();

  const handleAdd = () => {
    setFormData({ name: "", phoneNumber: "", email: "" });
    setEditingContact(null);
    setShowAddDialog(true);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact?.name,
      phoneNumber: contact?.phoneNumber,
      email: contact?.email,
    });
    setEditingContact(contact);
    setShowAddDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingContact) {
        await updateContact({
          id: editingContact?._id,
          data: formData,
        }).unwrap();
        toast.success("Cập nhật liên hệ thành công");
      } else {
        await createContact(formData).unwrap();
        toast.success("Thêm liên hệ thành công");
      }
      setShowAddDialog(false);
      setFormData({ name: "", phoneNumber: "", email: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteContact(deletingId).unwrap();
      toast.success("Xóa liên hệ thành công");
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Xóa thất bại");
    }
  };

  const columns = useMemo<ColumnDef<EmergencyContact>[]>(
    () => [
      {
        accessorKey: "name",
        header: isGlobal ? "Cơ quan/Đơn vị" : "Chức vụ",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.phoneNumber}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "organizationId",
        header: "Phạm vi",
        cell: ({ row }) =>
          !row.original.organizationId ? (
            <Badge variant="secondary">Global</Badge>
          ) : (
            <Badge variant="outline">Trường</Badge>
          ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Sửa
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingId(row.original._id);
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Xóa
            </Button>
          </div>
        ),
      },
    ],
    [isGlobal],
  );

  return (
    <>
      <div className="mb-6">
        <div className="flex items-end justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Liên hệ khẩn cấp</h1>
              {isGlobal ? (
                <Badge className="gap-1" variant="default">
                  <Globe className="h-3 w-3" />
                  Toàn Quốc
                </Badge>
              ) : (
                <Badge className="gap-1" variant="secondary">
                  <Building2 className="h-3 w-3" />
                  Trường
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {isGlobal
                ? "Quản lý liên hệ cơ quan chức năng (công an, y tế, cứu hộ...) nhận cảnh báo khẩn cấp"
                : "Quản lý liên hệ ban giám hiệu, giáo viên nhận cảnh báo khẩn cấp"}
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm liên hệ mới
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        <CardList
          columns={columns}
          data={contacts}
          isLoading={isFetching}
          onRowClick={({ data: contact }) => handleEdit(contact)}
        />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Cập nhật liên hệ" : "Thêm liên hệ mới"}
            </DialogTitle>
            <DialogDescription>
              {isGlobal
                ? "Nhập thông tin liên hệ khẩn cấp cấp hệ thống (cơ quan chức năng, công an, y tế...)"
                : "Chọn chức vụ và nhập thông tin liên hệ khẩn cấp của trường"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {isGlobal ? "Tên cơ quan/đơn vị" : "Chức vụ"}
              </Label>
              {isGlobal ? (
                <Input
                  id="name"
                  placeholder="VD: Công an phường, Trung tâm Y tế, Cứu hộ 115..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <Select
                  value={formData.name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                >
                  <SelectTrigger id="name">
                    <SelectValue placeholder="Chọn chức vụ liên hệ" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMERGENCY_CONTACT_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="VD: 0123456789"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="VD: contact@school.edu.vn"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button disabled={isCreating || isUpdating} onClick={handleSubmit}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : editingContact ? (
                "Cập nhật"
              ) : (
                "Thêm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
