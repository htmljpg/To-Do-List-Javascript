import view from "../views/NotFoundPage.html";

const NotFoundPage = () => {
  const divElement = document.createElement("div");
  divElement.innerHTML = view;
  

  return divElement;
}

export default NotFoundPage;
