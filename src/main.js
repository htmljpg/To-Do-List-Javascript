import { router } from './router';
import useAnim from './utils/useAnim';
import { ROOT_MAIN_PAGE } from './constants/root';

import './main.scss';

const init = async () => {
    useAnim(() => router(window.location.hash), ROOT_MAIN_PAGE);

    window.addEventListener('hashchange', () => {
        useAnim(() => router(window.location.hash), ROOT_MAIN_PAGE)
    });
};

window.addEventListener('load', init);