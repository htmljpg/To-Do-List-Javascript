const useAnim = (callback, block, delay = 100, animIn = 'animate__fadeIn', animOut = 'animate__fadeOut') => {
    animOut && block.classList.add(animOut);
    animIn && block.classList.remove(animIn);

    setTimeout(function() {
        animOut && block.classList.remove(animOut);
        animIn && block.classList.add(animIn);

        callback();
    }, delay);
}

export default useAnim;