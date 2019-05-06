export default m => {
  if(m.text().substring(0, 5).toLowerCase() === '@bot '){
    return m.text().substring(5);
  }else{
    return m.text();
  }
}
