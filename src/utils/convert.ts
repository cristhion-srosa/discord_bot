export function convertTime(duration: number) {
  let seconds = (duration / 1000) % 60,
    minutes = (duration / (1000 * 60)) % 60,
    hours = (duration / (1000 * 60 * 60)) % 24

    hours = hours < 10 ? 0 + hours : hours
    minutes = minutes < 10 ? 0 + minutes : minutes
    seconds = seconds < 10 ? 0 + seconds : seconds

  if (duration < 3600000) {
    return minutes + ":" + seconds
  } else {
    return hours + ":" + minutes + ":" + seconds
  }
}


export function convertNumber(number: number, decPlaces: number = 0) {
  decPlaces = Math.pow(10, decPlaces)
  let abbrev = ["K", "M", "B", "T"]
  for (let i = abbrev.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3)
  
    if (size <= number) {
      number = Math.round((number * decPlaces) / size) / decPlaces
      if (number == 1000 && i < abbrev.length - 1) {
          number = 1
          i++
      }
          return number + abbrev[i]
    }
  }
  return number.toString()
}
