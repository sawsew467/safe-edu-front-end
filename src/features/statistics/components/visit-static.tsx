"use client";

import { useProvinceVisitMutation, useVisitMutation } from '@/features/statistics/api';
import { useGetUserQuery } from '@/features/users/api/student.api';
import React, { useEffect, useState } from 'react'

function VisitStatic() {
    const [visit] = useVisitMutation();
    const [ip, setIp] = useState<string>("");
    const { user } = useGetUserQuery(undefined, {
        selectFromResult: ({ data }) => ({
            user: data?.data,
        }),
    });
    const provinceId = user?.organizationId?.province_id;
    const [provinceVisit] = useProvinceVisitMutation();

    useEffect(() => {
        const fetchIpAndVisit = async () => {
            try {
                const response = await fetch('https://api.ipify.org/?format=json');
                const data = await response.json();
                setIp(data.ip);
                visit({ ipAddress: data.ip });
                if (provinceId) {
                    provinceVisit(provinceId);
                }
            } catch (error) {
                console.error("Error fetching IP address:", error);
            }
        };
        fetchIpAndVisit();
    }, [visit, provinceId]);
    return null
}

export default VisitStatic