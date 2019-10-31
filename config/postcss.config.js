module.exports = {
    // parser: 'sugarss',
    plugins: {
/*        postcss: function() {
            return [px2rem({remUnit: 72})];
        },*/
        autoprefixer: {
            browsers: ['last 3 versions','iOS >= 8','Firefox >= 20','Android > 4.2','not ie <= 8']
        },
        'postcss-plugin-px2rem':{
        	rootValue: 100,
            unitPrecision: 8,
            propWhiteList: [],
            propBlackList: [],
            selectorBlackList: [],
            ignoreIdentifier: false,
            replace: true,
            mediaQuery: false,
            minPixelValue: 2     
        }

    }
};
/* browsers: ['> 1%', 'last 2 versions','not ie <= 8'] */
