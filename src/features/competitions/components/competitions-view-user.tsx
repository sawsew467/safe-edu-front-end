"use client";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

import { Competitions } from "../type.competitions";

import { CompetitionArticleCard } from "./competition-artile-card";

import { Button } from "@/components/ui/button";

const CompetitionsViewUser = ({
  competitions,
  label,
}: {
  competitions: Competitions[];
  label: string;
}) => {
  const [data, setData] = React.useState<Competitions[]>([]);
  const [viewMore, setViewMore] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (viewMore) {
      setData(competitions);
    } else {
      setData(competitions.slice(0, 3));
    }
  }, [viewMore, competitions]);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <motion.h2
          className="text-3xl font-bold text-primary"
          initial={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          {label}
        </motion.h2>
        <Button
          className="flex items-center gap-2 text-primary hover:text-primary"
          variant="ghost"
          onClick={() => {
            setViewMore(!viewMore);
          }}
        >
          {viewMore ? (
            <>
              Thu gọn
              <ChevronUp className="size-24" />
            </>
          ) : (
            <>
              Xem tất cả
              <ChevronDown className="size-24" />
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item) => (
          <CompetitionArticleCard
            key={item._id}
            description={item.description}
            endDate={item.endDate}
            image={item.image_url}
            slug={item.slug}
            startDate={item.startDate}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
};

export default CompetitionsViewUser;
