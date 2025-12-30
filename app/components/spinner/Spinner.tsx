import React from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

/**
 * The spinner component.
 * @param {ActivityIndicatorProps} rest - the props for the spinner component.
 * @returns {React.ReactElement} A React Element.
 */
const Spinner = ({ ...rest }: ActivityIndicatorProps) => <ActivityIndicator {...rest} />;

export default Spinner;
