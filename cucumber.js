module.exports = {
  default: {
    require: ['features/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    paths: ['features/**/*.feature'],
    timeout: 30000,
    tags: 'not @ignore'
  }
}