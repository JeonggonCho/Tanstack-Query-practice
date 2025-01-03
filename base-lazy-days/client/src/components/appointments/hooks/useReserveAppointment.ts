import { Appointment } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when we need functions for useMutation
async function setAppointmentUser(appointment: Appointment, userId: number | undefined): Promise<void> {
    if (!userId) return;
    const patchOp = appointment.userId ? "replace" : "add";
    const patchData = [{ op: patchOp, path: "/userId", value: userId }];
    await axiosInstance.patch(`/appointment/${appointment.id}`, {
        data: patchData,
    });
}

export function useReserveAppointment() {
    const queryClient = useQueryClient();

    const { userId } = useLoginData();

    const toast = useCustomToast();

    // useMutation에서 mutate를 리턴함
    // 캐시하지 않으므로 쿼리키 필요없음
    const { mutate } = useMutation({
        mutationFn: (appointment: Appointment) => {
            return setAppointmentUser(appointment, userId);
        },
        // 성공 시, 수행할 콜백함수
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
            toast({ title: "예약 성공하였습니다.", status: "success" });
        },
    });

    return mutate;
}
