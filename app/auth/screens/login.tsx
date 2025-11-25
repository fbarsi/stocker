import React, { useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '@utils/styles';
import * as Yup from 'yup';
import { Button, FormInput, ButtonTheme } from '@components';
import { useMutation } from '@tanstack/react-query';
import { loginApiCall } from '@api/auth';
import { AuthActionTypes } from '@shared/context/AuthContext';
import { LoginCredentials, LoginResponse } from '@shared/interfaces';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { AUTH_ROUTES } from '@utils/constants';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

export default function Login() {
  const navigation = useNavigation();
  const style = useStyles();
  const { state, dispatch } = useAuth();

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginApiCall,
    onSuccess: (data) => {
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    },
    onError: (error) => {
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: { error: `Error al iniciar sesión: ${error.message}` },
      });
    },
  });

  useEffect(() => {
    if (state.error) {
      Alert.alert(`Error al iniciar sesión: ${state.error}`);
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
    }
  }, [state.error]);

  const handleLogin = (values: { email: string; password: string; check: boolean }) => {
    dispatch({ type: AuthActionTypes.LOGIN_START });
    const { check, ...loginData } = values;
    loginMutation.mutate(loginData);
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
      {({ values, isValid, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={[
            style.authContainer,
            { flexGrow: 1, flex: 0 }, 
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraKeyboardSpace={-60}
        >
          <Text style={style.title}>Iniciar Sesión</Text>
          <FormInput
            placeholder="Correo electrónico"
            handleChange={handleChange('email')}
            handleBlur={handleBlur('email')}
            value={values.email}
            error={touched.email && errors.email ? errors.email : undefined}
            keyboardType="email-address"
          />
          <FormInput
            secureTextEntry={true}
            placeholder="Contraseña"
            handleChange={handleChange('password')}
            handleBlur={handleBlur('password')}
            value={values.password}
            error={touched.password && errors.password ? errors.password : undefined}
            keyboardType="default"
          />
          <Pressable style={style.containerRow} onPress={() => setFieldValue('check', !values.check)}>
            <MaterialIcons
              name={values.check ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={style.text.color}
            />
            <Text style={{color: style.text.color}}>Recordar mis datos</Text>
          </Pressable>
          <View style={style.divider} />
          <ButtonTheme />

          <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', minHeight: 100 }}>
            {state.isLoading ? (
              <ActivityIndicator size="large" color={style.text.color} />
            ) : (
              <>
                <Button text="Ingresar" onPress={() => handleSubmit()} disabled={!isValid} />
                <Button
                  text="Registrarse"
                  onPress={() => {
                    navigation.navigate(AUTH_ROUTES.REGISTER as never);
                  }}
                />
              </>
            )}
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
}
