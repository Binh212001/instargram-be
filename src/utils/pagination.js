const pagination = (page) => {
  if (page > 1) {
    return (page - 1) * 10;
  } else {
    return 0;
  }
};

module.exports = { pagination };
