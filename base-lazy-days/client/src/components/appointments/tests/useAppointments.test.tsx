// act -> 훅의 함수를 실행함
// waitFor -> 결과를 기다림
import { act, renderHook, waitFor } from "@testing-library/react";

import { useAppointments } from "../hooks/useAppointments";
import { AppointmentDateMap } from "../types";

import { createQueryClientWrapper } from "@/test-utils";

const getAppointmentCount = (appointments: AppointmentDateMap) => Object.values(appointments).reduce((runningCount, appointmentsOnDate) => runningCount + appointmentsOnDate.length, 0);

test("filter appointments by availability", async () => {
    const { result } = renderHook(() => useAppointments(), { wrapper: createQueryClientWrapper() });

    // 예약이 채워지길 기다리기 -> 이 과정은 MSW를 통한 네트워크 호출을 포함하므로 비동기적으로 진행됨
    // 예약이 0 이상인지 테스트
    await waitFor(() => expect(getAppointmentCount(result.current.appointments)).toBeGreaterThan(0));

    // available한 예약만 필터링
    const filteredAppointmentsLength = getAppointmentCount(result.current.appointments);

    // result 객체의 setShowAll을 true로 설정
    act(() => result.current.setShowAll(true));

    // 모든 예약은 필터링된 예약의 수 이상인지 테스트
    await waitFor(() => expect(getAppointmentCount(result.current.appointments)).toBeGreaterThan(filteredAppointmentsLength));
});
