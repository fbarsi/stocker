import React from 'react';
import { Text, View } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '@utils/styles';
import * as Yup from 'yup';
import { Button, FormInput } from '@components';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('* Campo requerido'),
  lastname: Yup.string().required('* Campo requerido'),
  email: Yup.string().email('* Formato de email inválido').required('* Campo requerido'),
  password: Yup.string().min(8, '* Debe tener al menos 8 caracteres').required('* Campo requerido'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], '* Las contraseñas deben coincidir')
    .required('* Campo requerido'),
});

export default function Register() {
  const navigation = useNavigation();
  const style = useStyles();

  return (
    <Formik
      initialValues={{
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => console.log(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }) => (
        <View style={style.container}>
          <Text style={style.title}>Registrarse</Text>

          <FormInput
            placeholder='Nombre'
            handleChange={handleChange('name')}
            handleBlur={handleBlur('name')}
            error={touched.name && errors.name}
            value={values.name}
          />
          <FormInput
            placeholder='Apellido'
            handleChange={handleChange('lastname')}
            handleBlur={handleBlur('lastname')}
            error={touched.lastname && errors.lastname}
            value={values.lastname}
          />
          <FormInput
            placeholder='Correo electrónico'
            handleChange={handleChange('email')}
            handleBlur={handleBlur('email')}
            error={touched.email && errors.email}
            value={values.email}
          />
          <FormInput
            secureTextEntry={true}
            placeholder='Contraseña'
            handleChange={handleChange('password')}
            handleBlur={handleBlur('password')}
            error={touched.password && errors.password}
            value={values.password}
          />
          <FormInput
            secureTextEntry={true}
            placeholder='Confirmar contraseña'
            handleChange={handleChange('confirmPassword')}
            handleBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword}
            value={values.confirmPassword}
          />

          <Button text="Siguiente" disabled={!isValid} onPress={handleSubmit} />
          <Button text="Volver" onPress={() => navigation.goBack()} />
        </View>
      )}
    </Formik>
  );
}
