import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { ThemeContext } from '@shared/ThemeContext';

interface IButton {
  text?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export function Button({ text, disabled, onPress }: IButton) {
  const { colors } = useContext(ThemeContext);

  return (
    <StyledPressable
      onPress={onPress}
      disabled={disabled}
      backgroundColor={disabled ? '#808080ff' : colors.primary}
    >
      <StyledText color={colors.on_primary}>{text}</StyledText>
    </StyledPressable>
  );
}

const StyledPressable = styled.Pressable<{ backgroundColor: string }>`
  margin-bottom: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 16px;
  font-weight: 900;
`;