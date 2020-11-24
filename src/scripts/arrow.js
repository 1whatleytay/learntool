const separator = '→'

export default function(text) {
  const lines = text.split('\n')
  const results = { }

  let index = 0
  while (index < lines.length) {
    let parts

    do {
      parts = lines[index++].split(separator).map(x => x.trim())
    } while (!parts.length && index < lines.length)

    while (index < lines.length && lines[index].trim().length === 0) {
      index++
    }

    if (index >= lines.length) {
      break
    }

    const key = parts[0]

    let answers = results[key]
    if (!answers) {
      answers = [ ]
      results[key] = answers
    }

    if (parts.length >= 2) {
      answers.push(...parts.slice(1).map(x => x.trim()).filter(x => x.length))
    }

    while (index < lines.length && lines[index].startsWith('- ')) {
      const answer = lines[index++].substring("- ".length).trim()

      if (answer.length) {
        answers.push(answer)
      }
    }

    if (!answers.length) {
      delete results[key]
    }
  }

  return results
}