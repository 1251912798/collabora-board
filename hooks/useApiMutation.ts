import { useMutation } from "convex/react";
import { useState } from "react";

const useApiMutation = (mutationFn: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const apiMutation = useMutation(mutationFn);

    const mutate = (payload: any) => {
        setIsLoading(true);
        return apiMutation(payload)
            .finally(() => setIsLoading(false))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                throw error;
            });
    };

    return {
        isLoading,
        mutate,
    };
};

export default useApiMutation;
