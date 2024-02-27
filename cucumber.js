var common = [
  '--require features/step_definitions/*.ts',
  '--require-module ts-node/register',
  '--format @cucumber/pretty-formatter',
  '--format cucumber-console-formatter',
  '--publish-quiet',
].join(' ');

module.exports = {
  default: common,
  foAsync: `--format-options '{"snippetInterface": "async-await"}'`,
};
