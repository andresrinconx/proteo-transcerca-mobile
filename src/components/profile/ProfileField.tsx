import { Text, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ProfileField = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <View className='flex-row justify-between overflow-hidden mb-0.5'>
      <View className='flex-row items-center'>
        <Text className='rounded-lg text-blue' style={{ width: wp(20), fontFamily: 'Poppins-SemiBold', fontSize: wp(3.5) }}>{label}:</Text>
        <Text className='rounded-lg text-gray' style={{ fontFamily: 'Poppins-SemiBold', fontSize: wp(3) }}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default ProfileField;