import { toast } from "@/components/app/toast";
import { MutationCache, QueryCache, QueryClient, QueryClientConfig } from "@tanstack/react-query";

function createTitle(errorMsg: string, actionType: "query" | "mutation") {
    const action = actionType === "query" ? "fetch" : "update";
    return `could not ${action} data: ${errorMsg ?? "error connecting to server"}`;
}

function errorHandler(title: string) {
    // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
    // one message per page load, not one message per query
    // the user doesn't care that there were three failed queries on the staff page
    //    (staff, treatments, user)

    // 중복된 토스트가 표시되지 않는지 확인 할 수 있게 토스트에 id 지정
    const id = "react-query-toast";

    if (!toast.isActive(id)) {
        toast({ id, title, status: "error", variant: "subtle", isClosable: true });
    }
}

export const queryClientOptions: QueryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 600000,
            gcTime: 900000,
            refetchOnWindowFocus: false,
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            const title = createTitle(error.message, "query");
            // 전역으로 쿼리 에러 처리하기
            errorHandler(title);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            const title = createTitle(error.message, "mutation");
            // 전역으로 변이 에러 처리하기
            errorHandler(title);
        },
    }),
};

export const queryClient = new QueryClient(queryClientOptions);
