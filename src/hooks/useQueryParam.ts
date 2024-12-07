import { useSearchParams } from "react-router-dom";

export const useQueryParam = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const getQueryParam = (key: string): string | null => {
        return searchParams.get(key)
    }

    const setQueryParam = (params: Record<string, string | number | null>) => {
        const newParam = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([key, value]) => {
            if (value === null) {
                newParam.delete(key)
            } else {
                newParam.set(key, value.toString())
            }
        })

        setSearchParams(newParam)
    }

    const deleteQuery = (key: string) => {
        const newParam = new URLSearchParams(searchParams.toString())
        newParam.delete(key)
        setSearchParams(newParam)
    }

    return {
        getQueryParam,
        setQueryParam,
        deleteQuery
    }
}
