import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Picker
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'


interface IBGEUfResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  // const [uf, setUf] = useState('')
  // const [city, setCity] = useState('')
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const navigation = useNavigation()

  useEffect(() => {
    axios
      .get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(({ data }) => setUfs(data.map(uf => uf.sigla)))
  }, [])

  useEffect(() => {
    if (selectedUf === '0') return;

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(({ data }) => setCities(data.map(city => city.nome)))
  }, [selectedUf])
  
  function handleSelectedUf(value: string) {
    setSelectedUf(value)
  }

  function handleSelectedCity(value: string) {
    setSelectedCity(value)
  }

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      // uf: 'GO',
      // city: 'Goiânia'
      uf: selectedUf,
      city: selectedCity
    })
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ImageBackground
        source={require('./../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 300, height: 400 }}
      >
        <View style={styles.main}>
          <Image source={require('./../../assets/logo.png')}/>
          <View>
            <Text style={styles.title}>Reduza o tempo de espera em filas</Text>
            <Text style={styles.description}>Monitore a fila do seu estabelecimento preferido.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.borderPicker}>
            <Picker
              selectedValue={selectedUf}
              style={styles.input}
              onValueChange={handleSelectedUf}
            >
              <Picker.Item label="Selecione uma UF" value="0" />
              {ufs.map(uf => (
                <Picker.Item key={uf} label={uf} value={uf} />
              ))}
            </Picker>
          </View>

          <View style={styles.borderPicker}>
            <Picker
              selectedValue={selectedCity}
              style={styles.input}
              onValueChange={handleSelectedCity}
            >
              <Picker.Item label="Selecione uma cidade" value="0" />
              {cities.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#3e3e3e'
  },

  main: {
    flex: 1,
    justifyContent: 'center'
  },

  title: {
    color: '#F2F2F2',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#F2F2F2',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  
  borderPicker: {
    height: 60,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden'
  },

  button: {
    backgroundColor: '#3DD990',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#F2F2F2',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;