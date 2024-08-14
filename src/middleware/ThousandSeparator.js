function thousandSeparator(jsonArray) {
  return jsonArray.map(obj => {
    for (let key in obj) {
      if (!isNaN(obj[key]) && obj[key] !== 0) {
        obj[key] = obj[key].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
    return obj;
  });
}

export default thousandSeparator