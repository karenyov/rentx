import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { useNetInfo } from "@react-native-community/netinfo";
import { synchronize } from "@nozbe/watermelondb/sync";

import Logo from "../../assets/logo.svg";
import { Car } from "../../components/Car";
import { api } from "../../services/api";
import { CarDTO } from "../../dtos/CarDTO";

import { Container, Header, TotalCars, HeaderContent, CarList } from "./styles";
import { LoadAnimation } from "../../components/LoadAnimation";
import { database } from "../../databases";
import { Car as ModelCar } from "../../databases/model/Car";

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const netInfo = useNetInfo();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate("CarDetails", { car });
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        const response = await api.get("/cars");

        setCars(response.data);

        /**
         *   const carCollection = database.get<ModelCar>("/cars");
        const cars = await carCollection.query().fetch();

        if (isMounted) {
          setCars(cars);
        }
         */
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (netInfo.isConnected) {
      Alert.alert("Você está On-Line");
    } else {
      Alert.alert("Você está Off-Line");
    }
  }, [netInfo.isConnected]);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offlineSynchronize();
    }
  }, [netInfo.isConnected]);

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = response.data;

        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post("/users/sync/", user);
      },
    });
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />

          {!loading && <TotalCars>total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      )}
    </Container>
  );
}
