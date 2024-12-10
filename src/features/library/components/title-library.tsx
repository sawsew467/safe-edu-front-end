"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { useRouter } from "next-nprogress-bar";

import { TypeTitleLibrary } from "../library.type";

import { Button } from "@/components/ui/button";

const TitleLibrary = ({ title, href, contentHref }: TypeTitleLibrary) => {
  const router = useRouter();

  return (
    <div className="flex w-full justify-between">
      {title && <h3 className="text-2xl font-bold mb-4">{title}</h3>}
      {href && (
        <Button
          className="h-8 px-2 lg:px-3"
          variant="outline"
          onClick={() => router.push(href)}
        >
          <PlusIcon className=" h-4 w-4" />

          {contentHref ?? ""}
        </Button>
      )}
    </div>
  );
};

export default TitleLibrary;
