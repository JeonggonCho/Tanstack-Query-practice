import { act, renderHook, waitFor } from "@testing-library/react";

import { useStaff } from "../hooks/useStaff";

import { createQueryClientWrapper } from "@/test-utils";

// staff 수가 4가 되는 것을 기다리기
// 훅의 필터 상태 값을 업데이트하기
// 새로운 필터 상태에 맞는 직원 수가 어떻게 되는지 확인
test("filter staff", async () => {
    const { result } = renderHook(() => useStaff(), {
        wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.staff).toHaveLength(4));

    act(() => result.current.setFilter("facial"));

    await waitFor(() => expect(result.current.staff).toHaveLength(3));
});
