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
  copy4: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 16
    lineHeight: 22
    color: ${color}
  `,
  copy4Italic: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.boldItalic}
    fontSize: 16
    lineHeight: 22
    color: ${color}
  `,
  copy3: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 12
    lineHeight: 18
    color: ${color}
  `,
  copy2: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 12
    lineHeight: 16
    color: ${color}
  `,
  copy1: (color = defaultColor) => `
    fontFamily: ${displayFontWeights.bold}
    fontSize: 10
    lineHeight: 14
    color: ${color}
  `,

}