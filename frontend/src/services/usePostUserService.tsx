import { useEffect, useState } from "react";
import { Service, IDraggableElement } from "../interfaces/interface";

export interface IUsers {
    results: IDraggableElement[];
}

const usePostUserService = () => {
    const [result, setResult] = useState<Service<IUsers>>({
        status: 'loading'
    });

    useEffect(() => {
        fetch('http://0.0.0.0/api/users')
            .then(response => response.json())
            .then(response => setResult({ status: 'loaded', payload: response}))
            .catch(error => setResult({ status: 'error', error}));
    }, []);

    return result;
};

export default usePostUserService;