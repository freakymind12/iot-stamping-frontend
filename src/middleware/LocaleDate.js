const formatDate = (dateString, detail = true) => {
  const date = new Date(dateString);
  const pad = (num) => {
    return num < 10 ? '0' + num : num;
  };

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (detail) {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
};

export default formatDate;
