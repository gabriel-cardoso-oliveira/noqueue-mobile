import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import io from 'socket.io-client'
import * as Location from 'expo-location'

import api from './../../services/api'
import { baseUrl } from './../../utils/baseUrl'

// const socket = io('http://10.0.2.2:3333')
const socket = io(baseUrl.url)

interface Unit {
  id: number;
  description: string;
  image: string;
  email: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

interface Password {
  unit_id: number;
  total: number;
}

const Points = () => {
  const [units, setUnits] = useState<Unit[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  const [passwords, setPasswords] = useState<Password[]>([])
  const navigation = useNavigation()
  const route = useRoute()

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Ooops...', 'Precisamos de sua permissão para obter a localização')
        return;
      }

      const location = await Location.getCurrentPositionAsync()
      const { latitude, longitude } = location.coords

      setInitialPosition([
        latitude,
        longitude
      ])
    }

    loadPosition()
  }, [])

  useEffect(() => {
    api.get('units', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
      }
    }).then(({ data }) => setUnits(data))
  }, [])

  useEffect(() => {
    api
    .get('passwords/count')
    .then(({ data }) => setPasswords(data))
  }, [])

  socket.on('receivedPassword', (password: Password[]) => {
    setPasswords(password);
  });

  function handleNavigateBack() {
    navigation.goBack()
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { unit_id: id })
  }

  function getPassword(unit_id: number) {
    const [password] = passwords.filter(pass => pass.unit_id === unit_id)

    if (Object.keys(password).length) return password.total;

    return 0;
  }

  function getRegion(region: any) {
    console.log('REGION', region);
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./../../assets/logo.png')}/>

          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={30} color="#3DD990"/>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa uma unidade com a menor fila.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
              onRegionChangeComplete={getRegion}
            >
              { units.map(unit => (
                <Marker
                  key={String(unit.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(unit.id)}
                  coordinate={{
                    latitude: unit.latitude,
                    longitude: unit.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    {/* <Image style={styles.mapMarkerImage} source={{ uri: unit.image_url }}/> */}
                    <Text style={styles.mapMarkerTitle}>{unit.description}</Text>
                    <Text style={styles.mapMarkerDescription}>
                      Fila: <Text style={styles.mapMarkerNumber}>
                        { getPassword(unit.id) }
                      </Text>
                    </Text>
                  </View>
                </Marker>
              )) }
            </MapView>
          ) }
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
    backgroundColor: '#3e3e3e',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
    color: '#F2F2F2',
  },

  description: {
    color: '#F2F2F2',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontWeight: "bold",
    color: '#F2F2F2',
    fontSize: 13,
    lineHeight: 23,
  },

  mapMarkerDescription: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#F2F2F2',
    fontSize: 13,
    lineHeight: 23,
  },

  mapMarkerNumber: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontWeight: "bold",
    color: '#F2F2F2',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#F2F2F2',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
