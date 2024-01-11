import { useState, useEffect } from 'react';
import { View, StatusBar, Text, Pressable } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ChevronDownIcon } from 'react-native-heroicons/mini';
import DatePicker from 'react-native-date-picker';
import { blue } from '../utils/theme';
import { fetchPayroll } from '../utils/api';
import { formatDate, getMonthInText } from '../utils/dates';
import { Payroll as PayrollInterface } from '../ts/payroll';
import { Header, PayrollDetails, Table } from '../components';

const Payroll = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [payroll, setPayroll] = useState<PayrollInterface[] | null>(null);
  const [payrollDate, setPayrollDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchPayroll({ date: formatDate(payrollDate, 'DESC') });
        if (res) {
          setPayroll(res);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProfileData();  
  }, [payrollDate]);

  return (
    <>
      <View className='flex-1 bg-background'>
        <StatusBar backgroundColor={blue} barStyle='light-content' />

        <Header title='Nómina' icon={require('../assets/payroll-blue.png')} />

        <View className='flex-col pt-8'>
          <Pressable className='flex-row justify-center items-center gap-x-1 ml-8 mb-6 py-1 rounded-lg bg-light-blue'
            onPress={() => setIsDatePickerOpen(true)}
            style={{ width: wp(45) }}
          >
            <Text className='text-blue' style={{ fontFamily: 'Poppins-Medium', fontSize: wp(4) }}>
              {getMonthInText(payrollDate)} - {payrollDate.getFullYear()}
            </Text>

            <ChevronDownIcon size={wp(6)} color={blue} />
          </Pressable>
          
          <View className='flex-col items-center'>
            <Table 
              columns={[
                { name: 'date', width: 28, type: 'text' },
                { name: 'number', width: 17, type: 'text' },
                { name: 'paid', width: 20, type: 'currency',
                  options: { currency: 'Bs.' }
                },
              ]}
              data={payroll as PayrollInterface[]}
              isLoading={isLoading}
              noRecordsMessage='No hay registros para este mes'
              showSearch={true}
              renderItem={(item) => <PayrollDetails item={item} />}
            />
          </View>
        </View>
      </View>

      <DatePicker
        modal
        mode='date'
        open={isDatePickerOpen}
        date={payrollDate}
        onConfirm={(date) => {
          setIsDatePickerOpen(false);
          setPayrollDate(date);
        }}
        onCancel={() => {
          setIsDatePickerOpen(false);
        }}
      />
    </>
  );
};

export default Payroll;