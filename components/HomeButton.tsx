import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components/native';
import { ThemeContext } from '@shared/context/ThemeContext';
import { Dimensions } from 'react-native';

interface HButton {
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
}

export function HomeButton({ disabled, onPress, children }: HButton) {
  const { colors } = useContext(ThemeContext);
  const window = Dimensions.get('window');

  return (
    <StyledPressable
      onPress={onPress}
      disabled={disabled}
      backgroundColor={disabled ? '#808080ff' : colors.primary}
      padding={window.width > 600 ? 30 : 20}
      gap={window.width > 600 ? 30 : 20}
    >
      {children}
    </StyledPressable>
  );
}

const StyledPressable = styled.Pressable<{ backgroundColor: string; padding: number; gap: number }>`
  margin-bottom: 10px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding: ${({ padding }) => padding}px;
  gap: ${({ gap }) => gap}px;
`;
