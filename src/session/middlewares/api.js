const apiMiddleware = (store) => (next) => (action) => {
    console.log('Middleware triggered!');
    next(action);
};

export default apiMiddleware;
