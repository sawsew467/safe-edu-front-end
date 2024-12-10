import React from "react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Cross2Icon as Cancel, UploadIcon } from "@radix-ui/react-icons";

import { Progress } from "./progress";
import { Button } from "./button";

export interface ImportModalProps {
  refetch: Function;
}

interface DragZoneProps {
  setDataForm: any;
  processing: boolean;
  setProcessing: Function;
}

interface ErrorLineProps {
  children: React.ReactNode;
}

function ErrorLine({ children }: ErrorLineProps) {
  return (
    <div className="border-1.5 border-red-500 rounded-3xl mx-2 my-1 bg-red-50 flex">
      <Cancel />
      <p className="text-red-600 px-1">{children}</p>
    </div>
  );
}

function DragZone({ setDataForm, setProcessing, processing }: DragZoneProps) {
  const ref = useRef<any>();
  const [dragActive, setDragActive] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<any>([]);
  const [file, setFile] = useState<any>();

  const handleClick = () => {
    if (ref.current) ref.current.click();
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      const items = e.dataTransfer.items;

      if (items.length > 1) {
        // More than one file is being dragged
        setDragActive(2);
      } else {
        const fileType = items[0].type;

        if (fileType.startsWith("image/")) {
          setDragActive(1);
        } else setDragActive(2);
      }
    } else if (e.type === "dragleave") {
      setDragActive(0);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(0);

    if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
      const droppedFile = e.dataTransfer.files[0];

      if (ref.current) {
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(droppedFile);
        ref.current.files = dataTransfer.files;

        const changeEvent = new Event("change", { bubbles: true });

        ref.current.dispatchEvent(changeEvent);
      }
    } else {
      toast.error("Không thể thêm được nhìu ảnh cùng một lúc!");
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length === 1) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      if (fileType.startsWith("image/")) {
        setFile(selectedFile);
        setDataForm(selectedFile);
      } else {
        toast.error("Chỉ thêm được ảnh!");
        e.target.value = ""; // Reset the input if invalid
      }
    }
  };

  return (
    <React.Fragment>
      <button
        className={`max-h-[300px] w-full text-center overflow-y-auto ${file ? "border-solid" : "border-dashed"} border-2 rounded-md h-fit ${file ?? "py-10"} ${dragActive == 2 ? "cursor-not-allowed" : "cursor-pointer"} ${file ? (error.length ? "border-red-500" : "border-green-500") : dragActive === 2 ? "border-primary" : dragActive === 1 ? "border-orange-200" : "border-primary/40"}`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={ref}
          accept="image/*"
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
        {processing || (
          <>
            {!file && (
              <div className="my-auto text-center">
                <UploadIcon className="mx-auto" />
                <div className="pointer-events-none">
                  <strong>Kéo và Thả vào đây</strong>
                  <p className="text-gray-400">
                    Hoặc nhấn vào để chọn ảnh trong thư mục
                  </p>
                </div>
              </div>
            )}
            {error.length !== 0 && (
              <div>
                {error.map((data: any, ind: number) => (
                  <ErrorLine
                    key={ind}
                  >{`Error at ${data.line}: ${data.msg}`}</ErrorLine>
                ))}
              </div>
            )}
            {file && error.length === 0 && (
              <div className="p-5">
                <h1 className="text-[30px] text-green-500">
                  Đã kiểm tra xong!
                </h1>
                <p className="text-green-300 text-[15px]">
                  Nhấp Thêm ảnh để hoàn tất
                </p>
                <p className="text-green-300 text-[15px]">
                  Hoặc nhấn vào đây để hủy
                </p>
              </div>
            )}
          </>
        )}
        {processing && <Progress value={progress} />}
      </button>
    </React.Fragment>
  );
}

function ImportExcelModal({ refetch }: ImportModalProps) {
  const [dataForm, setDataForm] = useState<any>();
  //   const [importUser, { isLoading }] = useImportUserMutation();
  //   const [getImport, importState] = useGetImportMutation();
  const [generating, setGenerating] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleUpload = useCallback(async () => {
    try {
      refetch();
    } catch (ex) {
      toast.error("Upload failed!");
    }
    close();
  }, [dataForm]);

  React.useEffect(() => {
    console.log("dataForm", dataForm);
  }, [dataForm]);

  return (
    <div className=" space-y-8">
      <DragZone
        processing={processing}
        setDataForm={setDataForm}
        setProcessing={setProcessing}
      />
      {dataForm && (
        <Button disabled={processing} variant="outline" onClick={handleUpload}>
          Thêm Ảnh
        </Button>
      )}
    </div>
  );
}

export default ImportExcelModal;
