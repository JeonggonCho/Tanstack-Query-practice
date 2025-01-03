import jsonpatch from "fast-json-patch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

export const MUTATION_KEY = "patch-user";

async function patchUserOnServer(newData: User | null, originalData: User | null): Promise<User | null> {
    if (!newData || !originalData) return null;
    // create a patch for the difference between newData and originalData
    const patch = jsonpatch.compare(originalData, newData);

    // send patched data to the server
    const { data } = await axiosInstance.patch(
        `/user/${originalData.id}`,
        { patch },
        {
            headers: getJWTHeader(originalData.token),
        }
    );
    return data.user;
}

export function usePatchUser() {
    const queryClient = useQueryClient();

    const { user } = useUser();

    const toast = useCustomToast();

    const { mutate: patchUser } = useMutation({
        mutationKey: [MUTATION_KEY],
        mutationFn: (newData: User) => patchUserOnServer(newData, user),
        onSuccess: () => {
            toast({ title: "유저 정보가 업데이트되었습니다.", status: "success" });
        },
        // onSettled는 성공(onSuccess)와 오류(onError)가 결합한 것과 같음
        // 변형이 해결되면 성공이든 오류든 상관없이 onSettled가 실행됨
        onSettled: () => {
            // invalidateQueries를 호출하는 것이 아닌 프로미스인 이 값을 반환해야 함
            // 변형이 진행 중일 때, 이 변형 데이터를 표시할 것임
            return queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
        },
    });

    return patchUser;
}
