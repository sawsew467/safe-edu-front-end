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
export enum StatusCompetition {
  Ongoing = "Đang diễn ra",
  Upcoming = "Sắp diễn ra",
  Outgoing = "Đã kết thúc",
}
export enum StatusCompetitionVN {
  "Đang diễn ra" = "Ongoing",
  "Sắp diễn ra" = "Upcoming",
  "Đã kết thúc" = "Outgoing",
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
  PaintingPropaganda = "Phần thi thực hành",
  SocialThinking = "Nghĩ luận xã hội",
  Practical = "Vẽ tranh cổ động",
}
