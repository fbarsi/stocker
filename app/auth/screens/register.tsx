import React, { useContext, useEffect } from 'react';
import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '@utils/styles';
import * as Yup from 'yup';
import { Button, FormInput } from '@components';
import { useMutation } from '@tanstack/react-query';
import { loginApiCall, registerApiCall } from '@api/auth';
import { AuthActionTypes, AuthContext } from '@shared/context/AuthContext';
import { LoginCredentials, LoginResponse, RegisterData, RegisterResponse } from '@shared/interfaces';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

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

  const registerMutation = useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: registerApiCall,
    onSuccess: (data, variables) => {
      loginMutation.mutate({ email: variables.email, password: variables.password });
    },
    onError: (error) => {
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: { error: `Error al registrarse: ${error.message}` },
      });
    },
  });

  useEffect(() => {
    if (state.error) {
      Alert.alert('Error', state.error);
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
    }
  }, [state.error]);

  const handleRegister = (values: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    dispatch({ type: AuthActionTypes.LOGIN_START });
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

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
      onSubmit={handleRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }) => (
        <KeyboardAwareScrollView
          bottomOffset={260}
          contentContainerStyle={[
            style.authContainer,
            { flexGrow: 1, flex: 0 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraKeyboardSpace={-170}
        >
          <Text style={style.title}>Registrarse</Text>

          <FormInput
            placeholder="Nombre"
            handleChange={handleChange('name')}
            handleBlur={handleBlur('name')}
            error={touched.name && errors.name ? errors.name : undefined}
            value={values.name}
          />
          <FormInput
            placeholder="Apellido"
            handleChange={handleChange('lastname')}
            handleBlur={handleBlur('lastname')}
            error={touched.lastname && errors.lastname ? errors.lastname : undefined}
            value={values.lastname}
          />
          <FormInput
            placeholder="Correo electrónico"
            handleChange={handleChange('email')}
            handleBlur={handleBlur('email')}
            error={touched.email && errors.email ? errors.email : undefined}
            value={values.email}
            keyboardType="email-address"
          />
          <FormInput
            secureTextEntry={true}
            placeholder="Contraseña"
            handleChange={handleChange('password')}
            handleBlur={handleBlur('password')}
            error={touched.password && errors.password ? errors.password : undefined}
            value={values.password}
            keyboardType="default"
          />
          <FormInput
            secureTextEntry={true}
            placeholder="Confirmar contraseña"
            handleChange={handleChange('confirmPassword')}
            handleBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
            value={values.confirmPassword}
            keyboardType="default"
          />

          <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', minHeight: 100 }}>
            {state.isLoading ? (
              <ActivityIndicator size="large" color={style.text.color} />
            ) : (
              <>
                <Button text="Siguiente" disabled={!isValid} onPress={handleSubmit} />
                <Button text="Volver" onPress={() => navigation.goBack()} />
              </>
            )}
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
}