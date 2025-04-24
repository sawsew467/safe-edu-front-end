export enum FieldFormItemType {
  Email = "email",
  Text = "text",
  Radio = "radio",
  Checkbox = "checkbox",
}

export enum UserRole {
  admin = "Quản trị viên",
  supervision = "Quan sát viên",
  manager = "Quản lí",
  citizen = "Cư dân",
  student = "Học sinh",
}

export enum UserRoleBE {
  Admin = "Quản trị viên",
  Supervision = "Quan sát viên",
  Manager = "Quản lí",
  Citizen = "Cư dân",
  Student = "Học sinh",
}
export enum StatusCompetition {
  Ongoing = "Đang diễn ra",
  Upcoming = "Sắp diễn ra",
  Outgoing = "Đã kết thúc",
  UnActive = "Tạm dừng",
  Active = "Hoạt động",
}
export enum StatusCompetitionVN {
  "Đang diễn ra" = "Ongoing",
  "Sắp diễn ra" = "Upcoming",
  "Đã kết thúc" = "Outgoing",
  "Tạm dừng" = "UnActive",
  "Hoạt động" = "Active",
}
export enum ManagerRole {
  admin = "Admin",
  supervision = "Supervision",
  manager = "Manager",
  unkown = "Unkown",
}
export enum Status {
  Active = "Hoạt động",
  unActive = "Tạm dừng",
}
export enum QuizzType {
  SingleChoice = "Phần thi lý thuyết",
  PaintingPropaganda = "Vẽ tranh cổ động",
  SocialThinking = "Nghĩ luận xã hội",
  Practical = "Phần thi thực hành",
}
export enum QuizzTypeVN {
  "Phần thi lý thuyết" = "phan-thi-ly-thuyet",
  "Phần thi thực hành" = "phan-thi-thuc-hanh",
  "Nghĩ luận xã hội" = "nghi-luan-xa-hoi",
  "Vẽ tranh cổ động" = "ve-tranh-co-dong",
}
