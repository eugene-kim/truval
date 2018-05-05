import { displayFontWeights } from './fontWeights';
import Colors from '../colors';


const defaultColor = Colors.text.darkGray;


export default {
  display1: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 22
    lineHeight: 30
    color: ${color}
  `,
  mediumBold: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 16
    lineHeight: 22
    color: ${color}
  `,
  extraSmall: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 10
    lineHeight: 14
    color: ${color}
  `,
}