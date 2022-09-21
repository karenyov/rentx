import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { BorderlessButton } from "react-native-gesture-handler";
import {
  Container,
  InputText,
  IconContainer,
  ChangePasswordVisibilityButton,
} from "./styles";
import { TextInputProps } from "react-native";

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>["name"];
  value?: string;
}

export function PasswordInput({ iconName, value, ...rest }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const theme = useTheme();

  const [isFocused, setIsFoscused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handleInputFocus() {
    setIsFoscused(true);
  }

  function handleInputBlur() {
    setIsFoscused(false);
    setIsFilled(!!value);
  }

  function handlePasswordVisibilityChange() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={iconName}
          size={24}
          color={
            isFocused || isFilled ? theme.colors.main : theme.colors.text_detail
          }
        />
      </IconContainer>

      <InputText
        {...rest}
        autoCorrect={false}
        secureTextEntry={isPasswordVisible}
        onFocus={handleInputFocus}
        handleInputFocus
        onBlur={handleInputBlur}
        isFocused={isFocused}
      />

      <BorderlessButton onPress={handlePasswordVisibilityChange}>
        <IconContainer>
          <Feather
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={24}
            color={theme.colors.text_detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  );
}
