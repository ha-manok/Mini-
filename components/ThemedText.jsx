import { StyleSheet, useColorScheme, Text } from 'react-native'
import {colors} from '../constants/colors'

    const ThemedText = ({ style, title = false,children,...props }) => {
  const colorScheme = useColorScheme()
  const theme = colors[colorScheme] ?? colors.light;

  const textColor = title ? theme.title : theme.text;


  return (
    <Text style={[{ color: textColor }, style]} {...props} > {children}</Text>
  );
};


export default ThemedText

