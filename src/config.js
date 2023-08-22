const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    defaultPath: '/dashboard/default',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    env: import.meta.env.DEV ? 'development' : 'production',
    baseUrl: import.meta.env.DEV ? 'http://localhost:8000/api' : 'https://itsteknosains.co.id/api',
    webUrl: import.meta.env.DEV ? 'http://localhost:8000' : 'https://api.itsteknosains.co.id'
};

export default config;
