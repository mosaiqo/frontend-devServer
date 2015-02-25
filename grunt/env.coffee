module.exports =
  coverage:
    APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/src/'

  app:
    JWT_SECRET:     '<%= jwtSecret %>'

    # paths
    APP_ROOT:       '<%= rootDir %>'
    APP_PUBLIC_DIR: '<%= frontendAppPublicDir %>'

    # redis
    REDIS_HOST: '<%= redis.host %>'
    REDIS_PORT: '<%= redis.port %>'

    # mongo
    MONGO_HOST:     '<%= mongo.host %>'
    MONGO_PORT:     '<%= mongo.port %>'
    MONGO_USER:     '<%= mongo.user %>'
    MONGO_PASSWORD: '<%= mongo.password %>'
    MONGO_DATABASE: '<%= mongo.database %>'

    # new relic
    NEW_RELIC_ENABLED:        '<%= newRelic.enabled %>'
    NEW_RELIC_NO_CONFIG_FILE: true
    NEW_RELIC_APP_NAME:       '<%= newRelic.appName %>'
    NEW_RELIC_LICENSE_KEY:    '<%= newRelic.licenceKey %>'
