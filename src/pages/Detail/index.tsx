import React, { useEffect, useState } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  Button,
  TextInput
} from 'react-native'
import Modal from 'react-native-modal'
import { AirbnbRating } from 'react-native-ratings'
import { RectButton } from 'react-native-gesture-handler'
import { LineChart } from 'react-native-chart-kit'
import Constants from 'expo-constants'
import DateTimePicker from '@react-native-community/datetimepicker'
import api from './../../services/api'

interface Params {
  unit_id: number;
}

interface Unit {
  id: number;
  code: string;
  description: string;
  email: string;
  image: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
}

interface Data {
  labels: string[];
  datasets: [{
    data: number[];
  }];
}

const Detail = () => {
  const [unit, setUnit] = useState<Unit>({} as Unit)
  const [dataChartsHour, setDataChartsHour] = useState<Data>({} as Data)
  const [dataChartsWeek, setDataChartsWeek] = useState<Data>({} as Data)
  const [dataStart, setDataStart] = useState('14/09/2020')
  const [dataEnd, setDataEnd] = useState('18/09/2020')
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [rating, setRating] = useState(0)

  const navigation = useNavigation()
  const route = useRoute()

  const routeParams = route.params as Params;

  useEffect(() => {
    const abortController = new AbortController()

    api
    .get(`units/${routeParams.unit_id}`)
    .then(({ data }) => setUnit(data))

    api
    .get(`charts/hour/${routeParams.unit_id}`)
    .then(({ data }) => setDataChartsHour(data))

    api
    .get(`charts/week/${routeParams.unit_id}`)
    .then(({ data }) => setDataChartsWeek(data))

    return () => abortController.abort();
  }, [])

  const chartConfig = {
    backgroundGradientFrom: '#212c26',
    backgroundGradientTo: '#000000',
    // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
    color: (opacity = 1) => `rgba(61, 217, 144, ${opacity})`
  };

  const screenWidth = Dimensions.get('window').width - 64;

  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;

  function handleNavigateBack() {
    navigation.goBack()
  }

  function onChangeDatePicker(event: any, selectedDate: any) {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  }

  function toggleModal() {
    setModalVisible(!isModalVisible);
  };

  if (!dataChartsHour.labels || !dataChartsWeek.labels) return null;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./../../assets/logo.png')}/>
          <TouchableOpacity onPress={handleNavigateBack}>
            {/* <Icon name="arrow-left" size={30} color="#EB2041"/> */}
            <Icon name="arrow-left" size={30} color="#3DD990"/>
          </TouchableOpacity>
        </View>

        <Text style={styles.unitName}>{unit.description}</Text>

        <SafeAreaView style={styles.safeAreaView}>
          <ScrollView>
            <View style={styles.address}>
              <Text style={styles.addressTitle}>Endereço</Text>
              <Text style={styles.addressContent}>{unit.city}, {unit.uf}</Text>
            </View>

            <View style={styles.separator} />

            <Text style={styles.description}>Média de atendimentos por hora:</Text>
            {dataChartsHour.labels.length ? (
              <LineChart
                data={dataChartsHour}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            ) : null}

            <Text style={styles.description}>Média de atendimentos por dia da semana:</Text>
            {dataChartsWeek.labels.length ? (
              <LineChart
                data={dataChartsWeek}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            ) : null}

            <RectButton style={styles.button} onPress={toggleModal}>
              <Icon name="filter" size={20} color="#FFF"/>
              <Text style={styles.buttonText}>Filtrar</Text>
            </RectButton>

            <View style={styles.separator} />

            <Text style={styles.ratingTitle}>Avaliações:</Text>

            <AirbnbRating
              count={5}
              onFinishRating={(rating: number) => setRating(rating)}
              reviews={["Péssimo", "Ruim", "Bom", "Ótimo", "Excelente"]}
              defaultRating={4}
              size={24}
              isDisabled={true}
            />
            <Text style={styles.ratingCount}>56</Text>

            <Text style={styles.ratingDescription}>Deixe a sua avaliação:</Text>

            <AirbnbRating
              count={5}
              onFinishRating={(rating: number) => setRating(rating)}
              reviews={["Péssimo", "Ruim", "Bom", "Ótimo", "Excelente"]}
              defaultRating={5}
              size={24}
            />
          </ScrollView>
        </SafeAreaView>
      </View>

      <Modal
        isVisible={isModalVisible}
        swipeDirection="down"
        deviceWidth={deviceWidth}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Filtro</Text>

            <Text style={styles.modalText}>Data Início</Text>
            <TextInput
              style={styles.input}
              placeholder="Data início"
              autoCorrect={false}
              value={dataStart}
              onKeyPress={() => setShow(true)}
            />

            <Text style={styles.modalText}>Data Fim</Text>
            <TextInput
              style={styles.input}
              placeholder="Data fim"
              autoCorrect={false}
              value={dataEnd}
              onKeyPress={() => setShow(true)}
            />

            <TouchableOpacity style={styles.opacityLink} onPress={toggleModal}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.opacityLinkText}>Cancelar </Text>

                <Icon name="x-circle" size={22} color="#8985F2"/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDatePicker}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
    backgroundColor: '#3e3e3e',
  },

  input: {
    height: 60,
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  opacityLink: {
    marginTop: 16,
  },

  opacityLinkText: {
    color: '#8985F2',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 16,
  },

  centeredView: {
    flex: 1,
    marginTop: 22
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  safeAreaView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  separator: {
    height: 1,
    // backgroundColor: 'rgba(50, 33, 83, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 20,
  },

  modalTitle: {
    marginBottom: 4,
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold',
    color: '#3DD990'
  },

  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 6,
    fontFamily: 'Roboto_500Medium',
  },

  unitImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  unitName: {
    // color: '#322153',
    color: '#F2F2F2',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
  },

  ratingTitle: {
    // color: '#322153',
    color: '#F2F2F2',
    fontSize: 26,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 20,
  },

  ratingDescription: {
    // color: '#322153',
    color: '#F2F2F2',
    fontSize: 22,
    fontFamily: 'Roboto_500Medium',
    marginTop: 20,
  },

  ratingCount: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 28,
    marginTop: 4,
    // color: '#322153',
    color: '#F2F2F2',
    textAlign: 'center'
  },

  description: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    color: '#F2F2F2'
  },

  address: {
    marginTop: 20,
  },

  addressTitle: {
    color: '#F2F2F2',
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 4,
    color: '#F2F2F2'
  },

  filterContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 32,
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    // backgroundColor: '#EB2041',
    backgroundColor: '#3DD990',
    height: 50,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    marginLeft: 8,
    color: '#F2F2F2',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;
