import view from "../views/HomePage.html";
import { IP_URL } from '../constants/api';
import useFetch from "../utils/useFetch";

const HomePage = async () => {
  const divElement = document.createElement("div");
  divElement.innerHTML = view;

  const ipBlock = divElement.querySelector("#ip");

  const { ip } = await useFetch(IP_URL);
  if (ip) {
    ipBlock.innerHTML = ip
  } else {
    ipBlock.innerHTML = 'Error';
  }

  return divElement;
}

export default HomePage;