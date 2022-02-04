const {
  createTemplateAction,
} = require("@backstage/plugin-scaffolder-backend");

function patchTemplate(containerRunner) {
  return createTemplateAction({
    id: "patch:template",
    schema: {
      input: {
        type: "object",
        properties: {
          patchFile: {
            type: "string",
            title: "Patch File",
            description: "Patch File",
            default: "patch.diff",
          },
        },
      },
    },
    async handler(ctx) {
      await patch(ctx);
    },
  });

  async function patch(ctx) {
    const workdir = ctx.workspacePath;
    const patchFile = ctx.input.patchFile;

    await containerRunner.runContainer({
      imageName: "busybox",
      command: "sh",
      args: [
        "-c",
        `cd workdir && patch -p1 --remove-empty-files < ${patchFile} && rm ${patchFile}`,
      ],
      mountDirs: { [workdir]: "/workdir" },
      envVars: { HOME: "/tmp" },
      logStream: ctx.logStream,
    });
  }
}

module.exports = { patchTemplate };
