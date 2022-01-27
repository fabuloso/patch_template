const { createTemplateAction } = require('@backstage/plugin-scaffolder-backend');

function patch_template(containerRunner) {
  return createTemplateAction({
    id: 'patch:template',
    schema: {
    },
    async handler(ctx) { await patch(ctx) }
  });

  async function patch(ctx) {
    const workdir = ctx.workspacePath;

    await containerRunner.runContainer({
      imageName: 'busybox',
      command: 'sh',
      args: [
        '-c',
        'cd workdir && patch -p1 < diff && rm diff'
      ],
      mountDirs: { [workdir]: '/workdir' },
      envVars: { HOME: '/tmp' },
      logStream: ctx.logStream,
    });
  }

}

module.exports = { patch_template }
