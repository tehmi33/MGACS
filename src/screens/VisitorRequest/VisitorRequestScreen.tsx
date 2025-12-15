import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';

import ResidentTypeSelector from '../../components/ResidentTypeSelector';
import DateTimeRangePickerField from '../../components/DateTimeRangePickerField';
import CheckPostDropdown from '../../components/CheckPostDropdown';
import VisitPurposeSelector from '../../components/VisitPurposeSelector';
import VisitorDestinationInput from '../../components/VisitorDestinationInput';
import CustomButton from '../../components/CustomButton';
import VisitDetailsInformation from '../../components/VisitDetailsInformation';

type ResidentType = 'family' | 'utility' | 'commercial';

export default function VisitorRequestScreen() {
  const { control, handleSubmit, watch } = useForm();
  const [showFullForm, setShowFullForm] = useState(false);

  const residentType = watch('residentType') as ResidentType;

  const maxHoursMap: Record<ResidentType, number> = {
    family: 48,
    utility: 12,
    commercial: 6,
  };

  const onSubmit = (data: any) => {
    console.log('FORM DATA:', data);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#f8fafc',
      }}
    >
      {/* COLLAPSIBLE SECTION */}
      <VisitDetailsInformation>
        {/* 1️⃣ Resident Type */}
        <ResidentTypeSelector control={control} />

        {/* 2️⃣ Date & Time */}
      
          <DateTimeRangePickerField
            control={control}
         
          />
        

        {/* CONTINUE */}
{/*       
          <CustomButton
            label="Continue"
            onPress={() => setShowFullForm(true)}
          /> */}
        

        {/* FULL FORM */}
          
            <CheckPostDropdown control={control} />
            <VisitPurposeSelector control={control} />
            <VisitorDestinationInput control={control} />

            {/* <CustomButton
              label="Submit Request"
              onPress={handleSubmit(onSubmit)}
            /> */}
          
        
      </VisitDetailsInformation>
    </ScrollView>
  );
}
