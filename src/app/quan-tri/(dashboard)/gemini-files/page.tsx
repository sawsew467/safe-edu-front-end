"use client";

import { useEffect, useState, useRef } from "react";
import {
  Loader2,
  RefreshCw,
  Trash2,
  Database,
  FileText,
  Upload,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeminiFile {
  name: string;
  displayName: string;
  metadata: {
    id?: string;
    documentName?: string;
    fileType?: string;
  };
}

interface Store {
  name: string;
  displayName: string;
  type: string;
  fileCount: number;
}

interface FilesData {
  stores: Store[];
  files: {
    knowledge: GeminiFile[];
    consulting: GeminiFile[];
  };
}

export default function GeminiFilesPage() {
  const [data, setData] = useState<FilesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    file: GeminiFile;
    type: "OFFICIAL" | "REFERENCE";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload dialog state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [fileType, setFileType] = useState<"OFFICIAL" | "REFERENCE">("OFFICIAL");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api-gemini/files");
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      toast.error("Không thể tải danh sách files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      // Try to delete using document name (more reliable)
      const response = await fetch("/api-gemini/ai-knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: {
            id: deleteTarget.file.metadata.id || deleteTarget.file.displayName,
            name: deleteTarget.file.name,
            displayName: deleteTarget.file.displayName,
            type: deleteTarget.type,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === "Deleted") {
        toast.success("Xóa file thành công");
        fetchFiles();
      } else {
        throw new Error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa file",
      );
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Chỉ hỗ trợ file PDF");

        return;
      }
      setUploadFile(file);
      if (!documentName) {
        setDocumentName(file.name.replace(".pdf", ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Vui lòng chọn file");

      return;
    }

    if (!documentName.trim()) {
      toast.error("Vui lòng nhập tên tài liệu");

      return;
    }

    setIsUploading(true);
    try {
      // First, upload file to get a URL (using a temporary approach)
      // For now, we'll create a data URL from the file
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          // Create a unique ID for this upload
          const uniqueId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // For direct upload, we need to modify the API to accept base64 or use a file upload service
          // For now, let's create a blob URL approach through the API
          const formData = new FormData();

          formData.append("file", uploadFile);
          formData.append("documentName", documentName);
          formData.append("fileType", fileType);
          formData.append("id", uniqueId);

          const response = await fetch("/api-gemini/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            toast.success("Upload tài liệu thành công");
            setIsUploadOpen(false);
            resetUploadForm();
            fetchFiles();
          } else {
            const error = await response.json();

            throw new Error(error.message || "Upload failed");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(
            error instanceof Error ? error.message : "Upload thất bại",
          );
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(uploadFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload thất bại");
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setDocumentName("");
    setFileType("OFFICIAL");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderFileTable = (
    files: GeminiFile[],
    type: "OFFICIAL" | "REFERENCE",
  ) => {
    if (files.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Chưa có file nào trong store này</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên file</TableHead>
            <TableHead>Document Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="w-[100px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={file.name || index}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {file.displayName || "N/A"}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {file.metadata.documentName || "N/A"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                {file.metadata.id || "N/A"}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteTarget({ file, type })}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gemini File Search</h1>
          <p className="text-muted-foreground">
            Quản lý tài liệu trong Gemini File Search Stores
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload tài liệu
          </Button>
          <Button disabled={loading} variant="outline" onClick={fetchFiles}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.stores.map((store) => (
          <Card key={store.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {store.type === "OFFICIAL"
                  ? "Knowledge Store"
                  : "Consulting Store"}
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.fileCount} files</div>
              <p className="text-xs text-muted-foreground truncate">
                {store.displayName}
              </p>
              <Badge className="mt-2" variant="outline">
                {store.type === "OFFICIAL" ? "Chính thống" : "Tham khảo"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Files Tabs */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Files</CardTitle>
            <CardDescription>
              Files đã được upload lên Gemini File Search để sử dụng cho RAG
              chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="knowledge">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="knowledge">
                  Knowledge ({data?.files.knowledge.length || 0})
                </TabsTrigger>
                <TabsTrigger value="consulting">
                  Consulting ({data?.files.consulting.length || 0})
                </TabsTrigger>
              </TabsList>
              <TabsContent className="mt-4" value="knowledge">
                {renderFileTable(data?.files.knowledge || [], "OFFICIAL")}
              </TabsContent>
              <TabsContent className="mt-4" value="consulting">
                {renderFileTable(data?.files.consulting || [], "REFERENCE")}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={isUploadOpen}
        onOpenChange={(open) => {
          setIsUploadOpen(open);
          if (!open) resetUploadForm();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload tài liệu mới</DialogTitle>
            <DialogDescription>
              Upload file PDF lên Gemini File Search để sử dụng cho RAG chatbot
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file">File PDF</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  accept=".pdf"
                  className="hidden"
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadFile ? uploadFile.name : "Chọn file PDF"}
                </Button>
              </div>
              {uploadFile && (
                <p className="text-xs text-muted-foreground">
                  Kích thước: {(uploadFile.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>

            {/* Document Name */}
            <div className="space-y-2">
              <Label htmlFor="documentName">Tên tài liệu</Label>
              <Input
                id="documentName"
                placeholder="Nhập tên tài liệu..."
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            {/* File Type */}
            <div className="space-y-2">
              <Label htmlFor="fileType">Loại tài liệu</Label>
              <Select
                value={fileType}
                onValueChange={(value: "OFFICIAL" | "REFERENCE") =>
                  setFileType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFFICIAL">
                    Chính thống (Knowledge)
                  </SelectItem>
                  <SelectItem value="REFERENCE">
                    Tham khảo (Consulting)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {fileType === "OFFICIAL"
                  ? "Tài liệu pháp lý, quy định chính thức"
                  : "Tài liệu tư vấn, hướng dẫn tham khảo"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadOpen(false);
                resetUploadForm();
              }}
            >
              Hủy
            </Button>
            <Button disabled={isUploading || !uploadFile} onClick={handleUpload}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Xóa file</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa file &quot;
              {deleteTarget?.file.displayName}&quot; khỏi Gemini File Search?
              <br />
              Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={handleDelete}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
