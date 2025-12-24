import React, { useCallback, useMemo, useState } from "react";
import { Download, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import ExcelJS from "exceljs";
import { ColumnDef } from "@tanstack/react-table";

import FileUploadDropzone from "./file-upload-dropzone";

import { useImportAdminsFromExcelMutation } from "@/services/common/upload/api.upload.admin";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/data-table/data-table";

interface ImportResult {
  successAccounts: Array<{
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  }>;
  failedAccounts: Array<{
    email?: string;
    phone_number?: string;
    row?: any;
    reason: string;
  }>;
  total: number;
  success: number;
  failed: number;
}

interface PreviewData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

function ImportAdminModal() {
  const [file, setFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const columns = useMemo<ColumnDef<PreviewData>[]>(
    () => [
      {
        accessorKey: "index",
        header: "STT",
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        accessorKey: "first_name",
        header: "Họ",
      },
      {
        accessorKey: "last_name",
        header: "Tên",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone_number",
        header: "Số điện thoại",
      },
    ],
    [],
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        setFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const [importAdminsFromExcel, { isLoading }] =
    useImportAdminsFromExcelMutation();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const result = await importAdminsFromExcel(formData).unwrap();

      setImportResult(result.data.data);
      setShowResult(true);
      toast.success(result.data.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Import dữ liệu thất bại");
    }
  };

  const handleImport = () => {
    if (file) {
      handleFileUpload(file);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        toast.error("File Excel không hợp lệ");

        return;
      }

      const data: PreviewData[] = [];

      worksheet.eachRow((row, rowNumber) => {
        // Skip header row
        if (rowNumber === 1) return;

        const rowData = {
          first_name: row.getCell(1).value?.toString() || "",
          last_name: row.getCell(2).value?.toString() || "",
          email: row.getCell(3).value?.toString() || "",
          phone_number: row.getCell(4).value?.toString() || "",
        };

        // Only add rows with at least email
        if (rowData.email) {
          data.push(rowData);
        }
      });

      if (data.length === 0) {
        toast.error("File Excel không có dữ liệu hợp lệ");

        return;
      }

      setPreviewData(data);
      setShowPreview(true);
      toast.success(`Đã tải ${data.length} bản ghi từ file Excel`);
    } catch (error) {
      toast.error("Không thể đọc file Excel. Vui lòng kiểm tra lại file.");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách quản trị viên");

      // Define columns
      worksheet.columns = [
        { header: "Họ", key: "first_name", width: 20 },
        { header: "Tên", key: "last_name", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Số điện thoại", key: "phone_number", width: 18 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true, size: 12 };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF72a318" },
      };
      worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      // Add sample data
      worksheet.addRow({
        first_name: "Nguyễn",
        last_name: "Văn A",
        email: "admin1@example.com",
        phone_number: "0123456789",
      });

      worksheet.addRow({
        first_name: "Trần",
        last_name: "Thị B",
        email: "admin2@example.com",
        phone_number: "0987654321",
      });

      // Add borders
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `Mau_import_quan_tri_vien.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Tải mẫu thành công");
    } catch (error) {
      toast.error("Không thể tải mẫu. Vui lòng thử lại sau.");
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFile(null);
    setImportResult(null);
    setShowResult(false);
    setPreviewData([]);
    setShowPreview(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="h-8 px-2 lg:px-3" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <h3 className="text-xl font-500">
              {showResult
                ? "Kết quả import"
                : showPreview
                  ? "Xem trước dữ liệu"
                  : "Nhập dữ liệu từ file Excel"}
            </h3>
            {!showResult && (
              <p className="text-stone-600 text-sm mt-1 font-normal">
                {showPreview
                  ? "Kiểm tra dữ liệu trước khi import vào hệ thống"
                  : "Hãy đảm bảo dữ liệu đúng với định dạng của file Excel mẫu"}
              </p>
            )}
          </DialogTitle>
        </DialogHeader>

        {!showResult ? (
          <DialogDescription>
            {!file ? (
              <FileUploadDropzone onDrop={onDrop} />
            ) : !showPreview ? (
              <div className="w-full pt-5 pb-6 px-4 flex justify-center items-center flex-col border border-primary rounded-md bg-muted/30">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12"
                        fill="#10b981"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-green-600 font-medium">
                          Tải lên thành công!
                        </p>
                        <p className="font-medium mt-1 truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setShowPreview(false);
                      setPreviewData([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div {...getRootProps()} className="mt-4 w-full">
                  <input {...getInputProps()} />
                  <p className="text-sm text-center text-stone-500 hover:underline cursor-pointer transition-all">
                    <Upload className="inline w-3 h-3 mr-1" />
                    Chọn file khác
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between bg-muted/30 p-3 rounded-md border border-primary">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-8 h-8"
                      fill="#10b981"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                    </svg>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {previewData.length} bản ghi
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setFile(null);
                      setShowPreview(false);
                      setPreviewData([]);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
                <div className="max-h-[400px] overflow-y-scroll">
                  <DataTable
                    columns={columns}
                    data={previewData}
                    showToolbar={false}
                  />
                </div>
              </div>
            )}
          </DialogDescription>
        ) : (
          <div className="flex-1 overflow-hidden">
            {importResult && (
              <div className="space-y-4 h-full flex flex-col">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Tổng số</p>
                    <p className="text-2xl font-bold">
                      {importResult?.total || 0}
                    </p>
                  </div>
                  <div className="border rounded-lg p-3 text-center bg-green-50">
                    <p className="text-sm text-green-700">Thành công</p>
                    <p className="text-2xl font-bold text-green-700">
                      {importResult?.success || 0}
                    </p>
                  </div>
                  <div className="border rounded-lg p-3 text-center bg-red-50">
                    <p className="text-sm text-red-700">Thất bại</p>
                    <p className="text-2xl font-bold text-red-700">
                      {importResult?.failed || 0}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 border rounded-lg overflow-y-scroll max-h-[400px]">
                  <div className="p-4 space-y-4">
                    {/* Success accounts */}
                    {importResult?.successAccounts &&
                      importResult.successAccounts.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-700">
                              Tài khoản tạo thành công (
                              {importResult.successAccounts.length})
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {importResult.successAccounts.map(
                              (account, index) => (
                                <div
                                  key={index}
                                  className="bg-green-50 border border-green-200 rounded-md p-3"
                                >
                                  <p className="font-medium text-sm">
                                    {account.first_name} {account.last_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {account.email}
                                    {account.phone_number &&
                                      ` • ${account.phone_number}`}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {importResult?.successAccounts &&
                      importResult.successAccounts.length > 0 &&
                      importResult?.failedAccounts &&
                      importResult.failedAccounts.length > 0 && (
                        <Separator className="my-4" />
                      )}

                    {/* Failed accounts */}
                    {importResult?.failedAccounts &&
                      importResult.failedAccounts.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h4 className="font-semibold text-red-700">
                              Tài khoản tạo thất bại (
                              {importResult.failedAccounts.length})
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {importResult.failedAccounts.map(
                              (account, index) => (
                                <div
                                  key={index}
                                  className="bg-red-50 border border-red-200 rounded-md p-3"
                                >
                                  {account.email && (
                                    <p className="font-medium text-sm">
                                      {account.email}
                                    </p>
                                  )}
                                  {account.phone_number && (
                                    <p className="text-xs text-muted-foreground">
                                      {account.phone_number}
                                    </p>
                                  )}
                                  <p className="text-xs text-red-600 mt-1">
                                    Lý do: {account.reason}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <div className="w-full justify-between items-center flex">
            {!showResult ? (
              <>
                {!showPreview ? (
                  <Button
                    className="flex gap-2 items-center"
                    variant="ghost"
                    onClick={handleDownloadTemplate}
                  >
                    <Download size={14} /> Tải mẫu
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowPreview(false);
                      setPreviewData([]);
                    }}
                  >
                    ← Quay lại
                  </Button>
                )}
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Hủy bỏ</Button>
                  </DialogClose>
                  {!showPreview ? (
                    <Button
                      disabled={!file}
                      variant="default"
                      onClick={handlePreview}
                    >
                      Xem trước
                    </Button>
                  ) : (
                    <Button
                      isLoading={isLoading}
                      variant="default"
                      onClick={handleImport}
                    >
                      Xác nhận import
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={handleClose}>
                  Đóng
                </Button>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportAdminModal;
