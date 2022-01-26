const { createTemplateAction , fetchContents} = require('@backstage/plugin-scaffolder-backend');
const { resolveSafeChildPath } = require('@backstage/backend-common');

function patch_template(containerRunner, reader, integrations) {
    return createTemplateAction({
        id: 'patch:template',
        schema: {

        },
        async handler(ctx){ await patch(ctx) }
    });

    async function patch(ctx) {
       let workdir = ctx.workspacePath; 
       let diffUrl = './diff';
       const diffPath = resolveSafeChildPath(workdir, 'diff.patch');

       await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: diffUrl,
        outputPath: diffPath,
      });

       await containerRunner.runContainer({
            imageName: 'busybox',
            command: 'sh',
            args: [
                '-c',
                ` cd workdir
                  patch -p1 < /tmp/diff.patch
                ` 
            ],
            mountDirs: { [workdir]: '/workdir', [diffPath]: '/tmp/diff.patch' },
            // The following is needed to make bash start in this folder, in order to avoid errors
            // when trying to create files in /
            envVars: { HOME: '/tmp' },
            logStream: ctx.logStream,
        }); 
    }    

}

module.exports = { patch_template }