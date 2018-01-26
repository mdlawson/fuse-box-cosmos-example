import "css/main.css";

const { mount } = require("react-cosmos-loader");

mount({
  proxies: [],
  fixtures: {
    Card: require("./components/Card/Card.fixtures"),
  },
});
