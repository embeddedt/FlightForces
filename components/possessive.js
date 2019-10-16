const possessive = (noun) => {
  if (typeof noun !== 'string') throw new TypeError('Value passed must be a string')
  if (noun.length === 0) throw new Error('Cannot make empty string possessive')
  if (noun.toLowerCase().endsWith('s')) return noun + '\''
  return noun + '\'s'
}

export default possessive;