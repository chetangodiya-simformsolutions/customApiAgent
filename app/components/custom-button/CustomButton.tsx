import { debounce } from 'lodash';
import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../../hooks';
import { Spinner } from '../spinner';
import { Text } from '../text';
import {
  activityIndicatorColor,
  buttonDefaultStyles,
  buttonVariantStyles,
  getTextVariant,
  textColor
} from './CustomButtonStyles';
import type { CustomButtonProps } from './CustomButtonTypes';

/**
 * The button component.
 * @param {CustomButtonProps} props - the props for the button component.
 * @returns {React.ReactElement} A React Element.
 */
const CustomButton = ({
  variant = 'solid',
  title,
  loading = false,
  disabled,
  onPress,
  titleProps,
  debounceTime = 300,
  enableDebounce = true,
  style,
  ...rest
}: CustomButtonProps) => {
  const { styles: buttonStyles, theme } = useTheme(buttonDefaultStyles);
  const { styles: variantStyles } = useTheme(buttonVariantStyles);

  const titleVariant = titleProps?.variant ?? getTextVariant(variant);

  // Debounce the onPress function only if enableDebounce is true
  const handleOnPress = enableDebounce
    ? debounce(
        (event) => {
          if (onPress) {
            onPress(event);
          }
        },
        debounceTime,
        { leading: true, trailing: false }
      )
    : onPress;

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles.defaultButtonStyle,
        variantStyles[variant],
        pressed && buttonStyles.pressedStyle,
        disabled && buttonStyles.disabledButtonStyle,
        typeof style === 'function' ? style({ pressed }) : style
      ]}
      disabled={loading || disabled}
      onPress={handleOnPress}
      {...rest}
    >
      {loading ? (
        <Spinner color={activityIndicatorColor(variant, theme)} />
      ) : (
        <Text
          variant={titleVariant}
          {...titleProps}
          style={[{ color: textColor(variant, theme) }, titleProps?.style]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;
