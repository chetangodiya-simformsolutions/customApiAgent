import { type TextProps as RNTextProps } from 'react-native';
import { textVariantsStyles } from './TextStyles';

export type TextVariant = keyof ReturnType<typeof textVariantsStyles>;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
}
