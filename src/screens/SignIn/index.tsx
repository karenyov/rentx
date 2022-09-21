import React, { useEffect, useState } from "react";
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Yup from "yup";

import { useTheme } from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { PasswordInput } from "../../components/PasswordInput";
import { useAuth } from "../../hooks/auth";

import { Container, Header, Title, Subtitle, Footer, Form } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { database } from "../../databases";

export function SignIn() {
  const theme = useTheme();
  const [email, setEmail] = useState("teste4@teste.com");
  const [password, setPassword] = useState("123");

  const navigaton = useNavigation();

  const { signIn } = useAuth();

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("E-mail obrigatório")
          .email("Digite um e-mail válido"),
        password: Yup.string().required("A senha é obrigatória"),
      });

      await schema.validate({ email, password });

      signIn({ email, password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert("Opa", error.message);
      } else {
        Alert.alert(
          "Erro na autenticação ",
          "Ocorreu um erro ao fazer login, verifique as credenciais"
        );
      }
    }
  }

  function handleNewAccount() {
    navigaton.navigate("SignUpFirstStep");
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />

          <Header>
            <Title>Estamos {"\n"} quase lá.</Title>
            <Subtitle>
              Faça seu login para começar {"\n"} uma experiência incrível.
            </Subtitle>
          </Header>

          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />

            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
            />

            <Button
              title="Criar conta gratuita"
              color={theme.colors.background_secondary}
              light
              onPress={handleNewAccount}
              enabled={true}
              loading={false}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
