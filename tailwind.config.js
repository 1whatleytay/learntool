module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: { },
  },
  variants: {
    opacity: ['group-hover'],
    textColor: ['active', 'hover'],
    backgroundColor: ['active', 'hover'],
    borderWidth: ['active'],
    margin: ['active'],
    shadow: ['active']
  },
  plugins: [],
}
