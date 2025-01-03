import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// 트리트먼트 데이터 가져오는 함수 -> axios 인스턴스 사용
async function getTreatments(): Promise<Treatment[]> {
    const { data } = await axiosInstance.get("/treatments");
    return data;
}

// useQuery로 treatment 데이터 가져와 캐시에 채우고 데이터 반환
export function useTreatments(): Treatment[] {
    const fallback: Treatment[] = [];

    // TODO: get data from server via useQuery
    // treatment에 대한 정보는 거의 변화가 없고 최신화되지 않아도 큰 문제가 없으므로
    // 네트워크 부하를 줄이기 위해 refetching 억제하기
    const { data = fallback } = useQuery({
        queryKey: [queryKeys.treatments],
        queryFn: getTreatments,
    });
    return data;
}

// prefetchQuery로 treatment 데이터를 미리 가져와 캐시만 채우기
export function usePrefetchTreatments(): void {
    // 캐시 채우기용으로 아무것도 반환 안 함
    const queryClient = useQueryClient();
    queryClient.prefetchQuery({
        queryKey: [queryKeys.treatments],
        queryFn: getTreatments,
    });
}
