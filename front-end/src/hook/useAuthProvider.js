import { useState } from 'react';
import { useLocalStorage } from 'react-use';


export default function useAuthProvider() {
    const [tokenPersistido, setTokenPersistido, removeTokenPersistido] = useLocalStorage('TOKEN', null);
    const [userPersistido, setUserPersistido, removeUserPersistido] = useLocalStorage('USER', '');

    const [token, setToken] = useState(tokenPersistido);
    const [produtos, setProdutos] = useState([]);

    const logar = (token, user) => {
        setToken(token);
        setTokenPersistido(token);
        setUserPersistido(user);
    } 

    const deslogar = () => {
        setToken(null);
        removeTokenPersistido();
        removeUserPersistido();
    }

    return {
        token,
        logar,
        deslogar,
        userPersistido,
        setUserPersistido,
        produtos,
        setProdutos
    };
};