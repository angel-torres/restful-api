// Create and export configuration variables

// Container for all the enviroments

var environments = {};

// Staging (default) environment 
environments.staging = {
    'port': 3000,
    'envName': 'staging'
};

// Production (default) environment 
environments.production = {
    'port': 3030,
    'envName': 'production'
};

// Determine which environmenet was passed as a command-line argument

var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environement is one of the environements above, if not, default to staging

const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;