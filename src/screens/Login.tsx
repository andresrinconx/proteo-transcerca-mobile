import { View, StatusBar, Image, TextInput, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { background, gray } from '../utils/theme';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/mini';
import { fetchAuth } from '../utils/api';
import { setDataStorage } from '../utils/asyncStorage';
import { shadow } from '../utils/theme';
import { getFCMToken } from '../helpers/pushNotification';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth, useForm } from '../hooks';
import { Loader } from '../components';

interface Props extends NativeStackScreenProps<any, any> {}

const Login = ({ navigation }: Props) => {
  const { setForm, user, password, showPassword, error, loadingAuth } = useForm({
    user: '',
    password: '',
    showPassword: false,
    error: '',
    loadingAuth: false,
  });
  const { setAuth, auth } = useAuth();

  const logIn = async () => {
    if ([user, password].includes('')) {
      setForm({ error: '* Todos los campos son obligatorios' });
      return;
    }
    
    setForm({ error: '', loadingAuth: true });
    
    try {
      const res = await fetchAuth({ 
        user, 
        password,
        fcmToken: await getFCMToken() as string
      });
      
      if (res) {
        await setDataStorage('jwt', res.jwt);
        setAuth({...auth, status: 'authenticated', isBoss: res.isBoss});
  
        navigation.replace('Home');
        setForm({ loadingAuth: false });
      } else {
        setForm({ error: '* Datos incorrectos', loadingAuth: false });
      }
    } catch (error) {
      setForm({ error: '* Datos incorrectos', loadingAuth: false });
    }
  };

  return (
    <View className='flex-1 bg-background'>
      <StatusBar backgroundColor={background} barStyle='dark-content' />
      
      {/* logo */}
      <View className='items-center pt-10'>
        <Image style={{ width: wp(70), height: wp(20) }} resizeMode='contain'
          source={require('../assets/logo.png')}
        />
      </View>

      {/* form */}
      <View className='px-16 pt-32 pb-20 space-y-8'>

        {/* user */}
        <View className='flex-col justify-center h-12 rounded-full bg-light-gray'>
          <TextInput className='pl-5 rounded-full font-semibold text-gray' 
            style={{ fontFamily: 'Poppins-Regular', fontSize: wp(4) }}
            placeholder='Usuario'
            placeholderTextColor={gray}
            value={user}
            onChangeText={(text) => setForm({ user: text })}
            selectionColor={gray}
          />
        </View>

        {/* password */}
        <View className='flex-col justify-center h-12 rounded-full bg-light-gray'>
          <TextInput className='pl-5 rounded-full font-semibold text-gray'
            style={{ fontFamily: 'Poppins-Regular', fontSize: wp(4) }}
            secureTextEntry={!showPassword}
            placeholder='Contraseña'
            placeholderTextColor={gray}
            value={password}
            onChangeText={(text) => setForm({ password: text })}
            selectionColor={gray}
          />
          {!showPassword && (
            <TouchableOpacity onPress={() => setForm({ showPassword: true })} className='absolute right-3'>
              <EyeIcon size={wp(7)} color={gray} />
            </TouchableOpacity>
          )}
          {showPassword && (
            <TouchableOpacity onPress={() => setForm({ showPassword: false })} className='absolute right-3'>
              <EyeSlashIcon size={wp(7)} color={gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* error */}
        <Text className='h-12 font-semibold text-center text-blue' style={{ fontFamily: 'Poppins-Regular', fontSize: wp(4) }}>
          {error ?? ''}
        </Text>

      </View>
      
      {/* baloon container */}
      <View className='flex-row items-center justify-center bg-background'>
        <View className='flex-row justify-center items-center rounded-t-full bg-blue' style={{ width: wp(160), height: wp(75) }}>
          <TouchableOpacity className='flex-row items-center justify-center rounded-full border-[8px] border-background bg-blue' 
            onPress={logIn}
            style={{
              ...shadow,
              width: wp(25), 
              height: wp(25), 
              top: wp(-37),
            }}
          >
            {loadingAuth ? (
              <Loader size={40} color='white' />
            ) : (
              <Image style={{ width: wp(10), height: wp(10) }} resizeMode='cover'
                source={require('../assets/arrow.png')}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;