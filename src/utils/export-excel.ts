import ExcelJS from "exceljs";

import { formatDate } from "./format-date";

import {
  Student,
  Citizens,
  Admin,
  Manager,
  Supervision,
} from "@/features/users/user.types";

export const exportStudentsToExcel = async (students: Student[]) => {
  try {
    if (!students || students.length === 0) {
      throw new Error("Không có dữ liệu để xuất");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách học sinh");

    // Define columns
    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Họ", key: "first_name", width: 20 },
      { header: "Tên", key: "last_name", width: 20 },
      { header: "Tên đầy đủ", key: "full_name", width: 30 },
      { header: "Tên tài khoản", key: "username", width: 20 },
      { header: "Lớp", key: "class_name", width: 15 },
      { header: "Tổ chức", key: "organization", width: 35 },
      { header: "Số điện thoại", key: "phone_number", width: 18 },
      { header: "Ngày sinh", key: "date_of_birth", width: 15 },
      { header: "Giới tính", key: "gender", width: 12 },
      { header: "Trạng thái", key: "isActive", width: 15 },
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

    // Add data
    students.forEach((student, index) => {
      try {
        worksheet.addRow({
          stt: index + 1,
          first_name: student?.first_name || "",
          last_name: student?.last_name || "",
          full_name:
            student?.full_name ||
            `${student?.first_name || ""} ${student?.last_name || ""}`.trim(),
          username: student?.username || "",
          class_name: student?.class_name || "",
          organization: student?.organizationId?.name || "",
          phone_number: student?.phone_number || "",
          date_of_birth: student?.date_of_birth
            ? formatDate(student.date_of_birth)
            : "",
          gender: student?.gender || "",
          isActive: student?.isActive ? "Hoạt động" : "Tạm dừng",
        });
      } catch {
        // Silent error handling - skip invalid rows
      }
    });

    // Add borders to all cells
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

    // Generate file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Danh_sach_hoc_sinh_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch {
    throw new Error("Lỗi khi xuất file Excel");
  }
};

export const exportCitizensToExcel = async (citizens: Citizens[]) => {
  try {
    if (!citizens || citizens.length === 0) {
      throw new Error("Không có dữ liệu để xuất");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách công dân");

    // Define columns
    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Họ", key: "first_name", width: 20 },
      { header: "Tên", key: "last_name", width: 20 },
      { header: "Tên đầy đủ", key: "full_name", width: 30 },
      { header: "Tên tài khoản", key: "username", width: 20 },
      { header: "Số điện thoại", key: "phone_number", width: 18 },
      { header: "Email", key: "email", width: 30 },
      { header: "Ngày sinh", key: "date_of_birth", width: 15 },
      { header: "Giới tính", key: "gender", width: 12 },
      { header: "Trạng thái", key: "isActive", width: 15 },
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

    // Add data
    citizens.forEach((citizen, index) => {
      try {
        worksheet.addRow({
          stt: index + 1,
          first_name: citizen?.first_name || "",
          last_name: citizen?.last_name || "",
          full_name:
            citizen?.full_name ||
            `${citizen?.first_name || ""} ${citizen?.last_name || ""}`.trim(),
          username: citizen?.username || "",
          phone_number: citizen?.phone_number || "",
          email: citizen?.email || "",
          date_of_birth: citizen?.date_of_birth
            ? formatDate(citizen.date_of_birth)
            : "",
          gender: citizen?.gender || "",
          isActive: citizen?.isActive ? "Hoạt động" : "Tạm dừng",
        });
      } catch {
        // Silent error handling - skip invalid rows
      }
    });

    // Add borders to all cells
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

    // Generate file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Danh_sach_cong_dan_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch {
    throw new Error("Lỗi khi xuất file Excel");
  }
};

export const exportAdminsToExcel = async (admins: Admin[]) => {
  try {
    if (!admins || admins.length === 0) {
      throw new Error("Không có dữ liệu để xuất");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách quản trị viên");

    // Define columns
    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Họ", key: "first_name", width: 20 },
      { header: "Tên", key: "last_name", width: 20 },
      { header: "Tên đầy đủ", key: "full_name", width: 30 },
      { header: "Số điện thoại", key: "phone_number", width: 18 },
      { header: "Email", key: "email", width: 30 },
      { header: "Trạng thái", key: "isActive", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
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

    // Add data
    admins.forEach((admin, index) => {
      try {
        worksheet.addRow({
          stt: index + 1,
          first_name: admin?.first_name || "",
          last_name: admin?.last_name || "",
          full_name:
            admin?.full_name ||
            `${admin?.first_name || ""} ${admin?.last_name || ""}`.trim(),
          phone_number: admin?.phone_number || "",
          email: admin?.email || "",
          isActive: admin?.isActive ? "Hoạt động" : "Tạm dừng",
          created_at: admin?.created_at ? formatDate(admin.created_at) : "",
        });
      } catch {
        // Silent error handling - skip invalid rows
      }
    });

    // Add borders to all cells
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

    // Generate file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Danh_sach_quan_tri_vien_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch {
    throw new Error("Lỗi khi xuất file Excel");
  }
};

export const exportManagersToExcel = async (managers: Manager[]) => {
  try {
    if (!managers || managers.length === 0) {
      throw new Error("Không có dữ liệu để xuất");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách quản lý viên");

    // Define columns
    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Họ", key: "first_name", width: 20 },
      { header: "Tên", key: "last_name", width: 20 },
      { header: "Tên đầy đủ", key: "full_name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Tổ chức", key: "organizations", width: 50 },
      { header: "Trạng thái", key: "isActive", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
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

    // Add data
    managers.forEach((manager, index) => {
      try {
        const orgNames =
          manager?.organizationId
            ?.map((org) => org?.name || "")
            .filter(Boolean)
            .join(", ") || "";

        worksheet.addRow({
          stt: index + 1,
          first_name: manager?.first_name || "",
          last_name: manager?.last_name || "",
          full_name:
            manager?.full_name ||
            `${manager?.first_name || ""} ${manager?.last_name || ""}`.trim(),
          email: manager?.email || "",
          organizations: orgNames,
          isActive: manager?.isActive ? "Hoạt động" : "Tạm dừng",
          created_at: manager?.created_at ? formatDate(manager.created_at) : "",
        });
      } catch {
        // Silent error handling - skip invalid rows
      }
    });

    // Add borders to all cells
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

    // Generate file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Danh_sach_quan_ly_vien_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch {
    throw new Error("Lỗi khi xuất file Excel");
  }
};

export const exportSupervisionsToExcel = async (
  supervisions: Supervision[],
) => {
  try {
    if (!supervisions || supervisions.length === 0) {
      throw new Error("Không có dữ liệu để xuất");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách quan sát viên");

    // Define columns
    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Họ", key: "first_name", width: 20 },
      { header: "Tên", key: "last_name", width: 20 },
      { header: "Tên đầy đủ", key: "full_name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Trạng thái", key: "isActive", width: 15 },
      { header: "Ngày tạo", key: "created_at", width: 20 },
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

    // Add data
    supervisions.forEach((supervision, index) => {
      try {
        worksheet.addRow({
          stt: index + 1,
          first_name: supervision?.first_name || "",
          last_name: supervision?.last_name || "",
          full_name:
            supervision?.full_name ||
            `${supervision?.first_name || ""} ${supervision?.last_name || ""}`.trim(),
          email: supervision?.email || "",
          isActive: supervision?.isActive ? "Hoạt động" : "Tạm dừng",
          created_at: supervision?.created_at
            ? formatDate(supervision.created_at)
            : "",
        });
      } catch {
        // Silent error handling - skip invalid rows
      }
    });

    // Add borders to all cells
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

    // Generate file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Danh_sach_quan_sat_vien_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch {
    throw new Error("Lỗi khi xuất file Excel");
  }
};
