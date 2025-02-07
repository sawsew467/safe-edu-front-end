"use client";
import { useState } from "react";

import { useGetAllOrganizationQuery } from "../organization.api";
import { Organization } from "../types";

import { OrganizationCard } from "@/features/organizations/components/organization-card";
import { SearchBar } from "@/features/organizations/components/search-bar";
import AddButton from "@/features/organizations/components/add-new-button";

export default function CardList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { organizations } = useGetAllOrganizationQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      organizations: data?.items ?? [],
      isFetching,
    }),
  });

  const filteredOrganizations = organizations?.filter((org: Organization) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex items-center">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <AddButton />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrganizations.map((org: Organization) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>
      {filteredOrganizations.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">
          No organizations found.
        </p>
      )}
    </div>
  );
}
