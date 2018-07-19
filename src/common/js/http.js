export function getPost(way) {
  let fw = Process.env.argv
  console.log(fw)
  if(fw){
    return fw + way
  }else{
    return way
  }
}
