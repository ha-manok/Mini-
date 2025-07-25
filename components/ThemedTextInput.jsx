import { TextInput, useColorScheme,View,Text} from 'react-native'
import { colors } from '../constants/colors'
import ThemedText from './ThemedText'
const ThemedTextInput = ({style,placeholderTextColor,label, ...props}) => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light
  return (
    <>
      <ThemedText title style={{fontSize: 14, marginBottom: 6,}}>{label}</ThemedText>
   
   <TextInput 
    style={[{
        backgroundColor: theme.uiBackground,
        color: theme.title,
        }, style]
    }
    placeholderTextColor={theme.placeholderColor}
    {...props}
   />
   </>
  )
}

export default ThemedTextInput