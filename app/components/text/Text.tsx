import React from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../../hooks';
import { textVariantsStyles } from './TextStyles';
import { type TextProps } from './TextTypes';

/**
 * A customizable Text component with variant-based styling and theme support.
 * @param {TextProps} props - The props for the Text component.
 * @param {TextVariant} [props.variant='body'] - The variant style to apply.
 * @param {StyleProp<TextStyle>} [props.style] - Additional custom styles.
 * @param {React.ReactNode} props.children - The text content.
 * @returns {JSX.Element} A styled Text component.
 */
const Text = ({ variant = 'body', style, children, ...rest }: TextProps) => {
  const { styles } = useTheme(textVariantsStyles);

  return (
    <RNText style={[styles[variant], style]} {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
