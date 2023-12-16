export const getTime = () => {
  const timer = new Date().getHours()
  let msg = ''
  // console.log(timer)

  if (timer <= 9) {
    msg = '早上好'
  } else if (timer <= 12) {
    msg = '上午好'
  } else if (timer <= 18) {
    msg = '下午好'
  } else {
    msg = '晚上好'
  }

  return msg
}
