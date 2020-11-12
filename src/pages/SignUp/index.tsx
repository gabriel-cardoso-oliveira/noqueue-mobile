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

// import { signUpRequest } from '~/store/modules/auth/actions';

export default function SignUp({ navigation }: any) {
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const loading = useSelector(state => state.auth.loading);

  // const dispatch = useDispatch();

  function handleSubmit() {
    // if (name && email && password)
      // dispatch(signUpRequest(name, email, password));
  }

  return (
    <Container>
      <Image source={require('./../../assets/logo.png')}/>
      <Form>
        <FormInput
          icon="user"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nome completo"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current.focus()}
          value={name}
          onChangeText={setName}
        />

        <FormInput
          icon="mail"
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Digite seu email"
          returnKeyType="next"
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current.focus()}
          value={email}
          onChangeText={setEmail}
        />

        <FormInput
          icon="lock"
          secureTextEntry
          placeholder="Sua senha secreta"
          returnKeyType="send"
          ref={passwordRef}
          onSubmitEditing={handleSubmit}
          value={password}
          onChangeText={setPassword}
        />

        <SubmitButton onPress={handleSubmit}>
          Criar
        </SubmitButton>

        <SignLink onPress={() => navigation.navigate('SignIn')}>
          <SignLinkText>Já tenho conta</SignLinkText>
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
