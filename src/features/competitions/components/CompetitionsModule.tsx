"use client";
import React from "react";

import { COMPETITIONS } from "../data.competitions";

import CardList from "@/components/ui/data-card";
import {
  ColumnCompetitions,
  columns,
} from "@/app/(dashboard)/cuoc-thi/columns.competitions";

const CompetitionsModule = () => {
  const data: ColumnCompetitions[] = COMPETITIONS?.map((competition) => ({
    ...competition,
    isActive: competition?.isActive ? "Hoạt động" : "Tạm dừng",
    organizations: competition?.organizations?.name,
  }));

  return <CardList columns={columns} data={data} />;
};

export default CompetitionsModule;
