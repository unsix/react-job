export default function getPost(way) {
  let fw = process.env.argv
  if(fw){
    return fw + way
  }else{
    return way
  }
}
