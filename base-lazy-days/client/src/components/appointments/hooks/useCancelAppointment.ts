import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

async function removeAppointmentUser(appointment: Appointment): Promise<void> {
    const patchData = [{ op: "remove", path: "/userId" }];
    await axiosInstance.patch(`/appointment/${appointment.id}`, {
        data: patchData,
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    const toast = useCustomToast();

    const { mutate } = useMutation({
        mutationFn: removeAppointmentUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
            toast({ title: "예약이 취소되었습니다.", status: "success" });
        },
    });

    return mutate;
}
