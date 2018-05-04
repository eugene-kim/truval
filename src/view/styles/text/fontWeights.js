/**
 * Creating an object that maps a font to its various font weights allows
 * for an simpler API when accessing the various font names and will mean
 * that any changes in the future will as simple as adding the new font
 * and updatnig the `displayFontFamily` value.
 */
const displayFontFamily = 'Nunito';


export const displayFontWeights = {
  black: `${displayFontFamily}-Black`,
  blackItalic: `${displayFontFamily}-BlackItalic`,
  bold: `${displayFontFamily}-Bold`,
  boldItalic: `${displayFontFamily}-BoldItalic`,
  extraBold: `${displayFontFamily}-ExtraBold`,
  extraBoldItalic: `${displayFontFamily}-ExtraBoldItalic`,
  extraLight: `${displayFontFamily}-ExtraLight`,
  italic: `${displayFontFamily}-Italic`,
  light: `${displayFontFamily}-Light`,
  lightItalic: `${displayFontFamily}-LightItalic`,
  regular: `${displayFontFamily}-Regular`,
  semiBold: `${displayFontFamily}-SemiBold`,
  semiBoldItalic: `${displayFontFamily}-SemiBoldItalic`,
};