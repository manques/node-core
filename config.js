/*
    primary file for the API
 */

// Containers for all environments
const environments = {};

// Staging (default) enviroment
environments.staging = {
    envName: 'staging',
    httpPort: 3000,
    httpsPort: 3001,
    passwordSecret: 'writethesecretpassword'
};

// Production enviroment
environments.production = {
    envName: 'production',
    httpPort: 5000,
    httpsPort: 5001,
    passwordSecret: 'writethesecretpassword'
}

// Determine which environment variable was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? environments[process.env.NODE_ENV]: '';

// check that the current environment is one of the environment above, if not, default to staging
const environmentToExport = typeof(currentEnvironment) === 'object' ?  currentEnvironment: environments.staging;

module.exports = environmentToExport;