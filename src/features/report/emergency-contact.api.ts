"use client";

import { baseApiAdmin } from "@/redux/admin/baseApi";

export interface EmergencyContact {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  organizationId?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmergencyContactPayload {
  name: string;
  phoneNumber: string;
  email: string;
  organizationId?: string;
}

export interface UpdateEmergencyContactPayload {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

export const emergencyContactAPI = baseApiAdmin.injectEndpoints({
  endpoints: (build) => ({
    getEmergencyContacts: build.query({
      query: () => ({
        url: "/emergency-contacts",
        method: "GET",
        flashError: true,
      }),
      providesTags: ["EmergencyContacts"],
    }),

    createEmergencyContact: build.mutation<
      { data: EmergencyContact },
      CreateEmergencyContactPayload
    >({
      query: (data) => ({
        url: "/emergency-contacts",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: ["EmergencyContacts"],
    }),

    updateEmergencyContact: build.mutation<
      { data: EmergencyContact },
      { id: string; data: UpdateEmergencyContactPayload }
    >({
      query: ({ id, data }) => ({
        url: `/emergency-contacts/${id}`,
        method: "PATCH",
        body: data,
        flashError: true,
      }),
      invalidatesTags: ["EmergencyContacts"],
    }),

    deleteEmergencyContact: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/emergency-contacts/${id}`,
        method: "DELETE",
        flashError: true,
      }),
      invalidatesTags: ["EmergencyContacts"],
    }),
  }),
});

export const {
  useGetEmergencyContactsQuery,
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
} = emergencyContactAPI;
