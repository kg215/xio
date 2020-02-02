module.exports = {
    plugins: {
        'postcss-preset-env': {
            'pxtorem':{}
        },
        'postcss-pxtorem': {
            rootValue: 10,
            "selectorBlackList":[".ant"],
            propList: ['*']
          }
    }
  }