import { View, Text, Pressable } from 'react-native';
import React, { useContext } from 'react';
import { AuthActionTypes, AuthContext } from '@shared/AuthContext';
import { useStyles } from '@utils/styles';
import { useNavigation } from '@react-navigation/native';
import { AUTH_ROUTES } from '@utils/constants';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FormInput, Button, ButtonTheme } from '@components';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export default function Login() {
  const navigation = useNavigation();
  const { dispatch } = useContext(AuthContext);
  const style = useStyles();

  const handleLogin = () => {
    dispatch({
      type: AuthActionTypes.LOGIN_SUCCESS,
      payload: {
        user: 'Fran',
        token: 'TOKEN',
      },
    });
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        check: false,
      }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ values, isValid, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <View style={style.container}>
          <Text style={style.title}>Iniciar Sesión</Text>
          <FormInput
            placeholder="Correo electrónico"
            handleChange={handleChange('email')}
            handleBlur={handleBlur('email')}
            value={values.email}
            hideErrorBelow={true}
          />
          <View style={style.divider} />
          <FormInput
            secureTextEntry={true}
            placeholder="Contraseña"
            handleChange={handleChange('password')}
            handleBlur={handleBlur('password')}
            value={values.password}
            hideErrorBelow={true}
          />
          <Text style={[style.error]}>
            {touched.email && touched.password && !isValid && 'Debes ingresar email y contraseña'}
          </Text>
          <Pressable
            style={style.containerRow}
            onPress={() => setFieldValue('check', !values.check)}
          >
            <MaterialIcons
              name={values.check ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={style.text.color}
            />
            <Text style={{ ...style.text, flex: 1 }}>Recordar mis datos</Text>
          </Pressable>
          <Button text="Ingresar" onPress={handleSubmit} />
          <Button
            text="Registrarse"
            onPress={() => {
              navigation.navigate(AUTH_ROUTES.REGISTER);
            }}
          />
          <ButtonTheme />
        </View>
      )}
    </Formik>
  );
}
