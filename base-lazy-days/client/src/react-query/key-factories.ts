import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, userToken: string) => {
    // 사용자 토큰 의도적으로 배제하기
    // 토큰이 갱신되며 쿼리가 달라지고 캐시 관리 데이터 주체가 바뀌게 됨
    return [queryKeys.user, userId];
};

export const generateUserAppointmentsKey = (userId: number, userToken: string) => {
    return [queryKeys.appointments, queryKeys.user, userId, userToken];
};
