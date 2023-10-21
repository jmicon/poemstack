import { useState, useEffect } from 'react';

const useFetch = <T,>(url: string, initialState: T): [T, boolean, any, React.Dispatch<React.SetStateAction<T>>] => {
    const [data, setData] = useState<T>(initialState)
    const [loading, setLoading] = useState(true)
    // const [error, setError] = useState<unknown | object>(null)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setData(data)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }

        fetchData()
    }, [url])
    return [data, loading, error, setData]
};

export default useFetch
