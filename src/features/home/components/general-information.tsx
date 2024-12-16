import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GeneralInformation() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Tổng Kết Cuộc Thi</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">
                Tổng Số Cuộc Thi Đã Hoàn Thành:
              </span>{" "}
              25
            </li>
            <li>
              <span className="font-semibold">
                Số Người Tham Gia Trung Bình mỗi Cuộc Thi:
              </span>{" "}
              75
            </li>
            <li>
              <span className="font-semibold">Điểm Trung Bình:</span> 82/100
            </li>
            <li>
              <span className="font-semibold">Tổng Số Người Chiến Thắng:</span>{" "}
              75
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tác Động của Ứng Dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Giảm Sử Dụng Ma Túy:</span> 15%
            </li>
            <li>
              <span className="font-semibold">Tăng Nhận Thức:</span> 40%
            </li>
            <li>
              <span className="font-semibold">Cải Thiện Điểm Kiểm Tra:</span>{" "}
              25%
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
