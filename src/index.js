const { createTemplateAction } = require('@backstage/plugin-scaffolder-backend');
const { join } = require('path');

function patch_template(containerRunner, reader, integrations) {
  return createTemplateAction({
    id: 'patch:template',
    schema: {
    },
    async handler(ctx) { await patch(ctx) }
  });

  async function patch(ctx) {
    let workdir = ctx.workspacePath;
    let diffPath = join(ctx.workspacePath, 'diff');

    await containerRunner.runContainer({
      imageName: 'busybox',
      command: 'sh',
      args: [
        '-c',
        'cd workdir && patch -p1 < /tmp/diff.patch'
      ],
      mountDirs: { [workdir]: '/workdir', [diffPath]: '/tmp/diff.patch' },
      envVars: { HOME: '/tmp' },
      logStream: ctx.logStream,
    });
  }

}

module.exports = { patch_template }
