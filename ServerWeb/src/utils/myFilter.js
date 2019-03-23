const myFilter = {
  date: date => {
    return new Date(date).toLocaleString()
  },
  ip: ip => {
    if (ip === '::1') {
      return '本地访问'
    }
    else if (ip.indexOf('::ffff:') > -1) {
      return ip.split('::ffff:')[1]
    } else {
      return ip
    }
  }
}

export default myFilter