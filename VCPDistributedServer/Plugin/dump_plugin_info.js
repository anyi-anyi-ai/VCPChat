const fs = require('fs');
const path = require('path');

const pluginDir = 'H:\\VCP\\VCPzhangduan\\VCPChat\\VCPDistributedServer\\Plugin';
const dumpFile = path.join(pluginDir, 'plugins_raw_dump.json');

const plugins = [];
const entries = fs.readdirSync(pluginDir, { withFileTypes: true });

for (const entry of entries) {
    if (entry.isDirectory()) {
        const pPath = path.join(pluginDir, entry.name);
        const manifestPath = path.join(pPath, 'plugin-manifest.json');

        if (fs.existsSync(manifestPath)) {
            try {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

                let codeExtract = "";
                if (manifest.entryPoint && manifest.entryPoint.script) {
                    const jsPath = path.join(pPath, manifest.entryPoint.script);
                    if (fs.existsSync(jsPath)) {
                        const code = fs.readFileSync(jsPath, 'utf8');
                        codeExtract = code.split('\\n').slice(0, 30).join('\\n');
                    }
                }

                plugins.push({
                    id: entry.name,
                    name: manifest.displayName || manifest.name,
                    desc: manifest.description || "",
                    config: Object.keys(manifest.configSchema || {}),
                    commands: (manifest.capabilities && manifest.capabilities.invocationCommands) ?
                        manifest.capabilities.invocationCommands.map(c => c.commandIdentifier || c.command) : [],
                    codeSnippet: codeExtract
                });
            } catch (e) {
                // Ignore parse errors
            }
        }
    }
}

fs.writeFileSync(dumpFile, JSON.stringify(plugins, null, 2), 'utf8');
console.log(`Dumped \${plugins.length} plugins.`);
