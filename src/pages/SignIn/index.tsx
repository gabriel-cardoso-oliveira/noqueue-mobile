import React, { useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
// import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';
// import Background from '~/components/Background';

// import { signInRequest } from '~/store/modules/auth/actions';

export default function SignIn({ navigation }: any) {
  // const dispatch = useDispatch();
  const passwordRef = useRef<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const loading = useSelector((state) => state.auth.loading);

  function handleSubmit() {
    // if (email && password) dispatch(signInRequest(email, password));
  }

  return (
    <Container>
      <Image source={require('./../../assets/logo.png')}/>
      <Form>
        <FormInput
          icon="mail"
          keyboardType="mail"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Digite seu email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
          value={email}
          onChangeText={setEmail}
        />

        <FormInput
          icon="lock"
          secureTextEntry
          placeholder="Sua senha secreta"
          ref={passwordRef}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          value={password}
          onChangeText={setPassword}
        />

        <SubmitButton onPress={handleSubmit}>
          Acessar
        </SubmitButton>

        <SignLink onPress={() => navigation.navigate('SignUp')}>
          <SignLinkText>Criar conta gratuita</SignLinkText>
        </SignLink>

        <SignLink onPress={() => navigation.navigate('Home')}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <SignLinkText>Home </SignLinkText>

            <Icon name="home" size={22} color="#3DD990"/>
          </View>
        </SignLink>
      </Form>
    </Container>
  );
}
