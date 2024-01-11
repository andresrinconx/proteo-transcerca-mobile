import { createContext, useEffect, useState } from 'react';
import { getDataStorage, removeDataStorage, setDataStorage } from '../utils/asyncStorage';
import { Auth } from '../ts/user';
import { fetchLogOut, fetchValidate } from '../utils/api';
import { useNavigation } from '../hooks';

interface AuthContextProps {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  logOut: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({
    status: 'checking',
    id: '',
    isBoss: false,
    isHRBoss: false,
  });
  const navigation = useNavigation();

  useEffect(() => {
    checkAuth();
  }, []);
  
  // Check auth
  const checkAuth = async() => {
    const jwt = await getDataStorage('jwt');
    
    if (!jwt) return setAuth({ ...auth, status: 'notAuthenticated' });

    try {
      const { isBoss, isHRBoss, jwt, id } = await fetchValidate();
      await setDataStorage('jwt', jwt);
      setAuth({
        ...auth, 
        status: 'authenticated', 
        id,
        isHRBoss,
        isBoss,
      });
    } catch (error) {
      if (jwt) return setAuth({ ...auth, status: 'authenticated' });
      setAuth({...auth, status: 'notAuthenticated'});
    }
  };

  // Log out
  const logOut = async () => {
    setAuth({
      ...auth,
      status: 'notAuthenticated',
      isBoss: false,
    });
    await fetchLogOut();

    await removeDataStorage('jwt');

    navigation.navigate('Login');
  };

  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      logOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};