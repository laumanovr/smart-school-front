module.exports = {
    runtimeCompiler: true,
    transpileDependencies: [
		'vuetify'
	],

    devServer: {
		proxy: {
		  '^/api' : {
		    target: 'http://localhost:5000',
				changeOrigin: true
		  }
		}
	},

    lintOnSave: false,

    pluginOptions: {
      i18n: {
        locale: 'ru',
        fallbackLocale: 'ru',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
};
