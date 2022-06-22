const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    defaultPath: '/dashboard/default',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    env: process.env.NODE_ENV,
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://itstekno.beta/api' : 'https://itsteknosains.co.id/api'
};

export default config;
