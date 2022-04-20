import { ROOT_MAIN_PAGE } from '../constants/root';
import useAnim from '../utils/useAnim';
import pages from '../pages';

const router = async (route) => {
    ROOT_MAIN_PAGE.innerHTML = '';

    route = route === '' ? '#/' : route;
    

    switch(route) {
        case '#/': {
            return ROOT_MAIN_PAGE.appendChild(await pages.HomePage());
        }
        case '#/todos':
            return ROOT_MAIN_PAGE.appendChild(await pages.TodosPage());
        default:
            return ROOT_MAIN_PAGE.appendChild(pages.NotFound());
    }
    
}

export { router };