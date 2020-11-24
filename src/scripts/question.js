import shuffle from '@/scripts/shuffle'

export default function(definitions) {
  const keys = Object.keys(definitions)
  const question = keys[Math.floor(Math.random() * keys.length)]
  const correct = definitions[question]

  const minAlt = 2
  const maxAlt = 3

  const numAlt = Math.floor(Math.random() * (maxAlt - minAlt) + maxAlt)

  const possible = Object.values(definitions)

  const other = []

  for (let a = 0; a < numAlt; a++) {
    const incorrect = possible[Math.floor(Math.random() * possible.length)]
    other.push(incorrect[Math.floor(Math.random() * incorrect.length)])
  }

  const answers = other.concat(correct)
  shuffle(answers)

  return {
    question,
    correct,
    answers
  }
}