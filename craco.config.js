module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    fs: false,
                    path: false,
                    crypto: false,
                },
            },
            experiments: {
                topLevelAwait: true,
            },
        },
    },
};
