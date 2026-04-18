import { workspace, ExtensionContext, window, commands, Uri } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	window.showInformationMessage("CE-Lang Extension is activating!");

    const command = 'ce';
    const serverOptions: ServerOptions = {
        run: { 
            command: command, 
            args: ['lsp'] 
        },
        debug: { 
            command: command, 
            args: ['lsp'] 
        }
    };
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'ce' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.ce')
        },
    };
    client = new LanguageClient(
        'ceLanguageServer',
        'CE Language Server',
        serverOptions,
        clientOptions
    );
    client.start();

    let runCommand = commands.registerCommand('ce.run', (uriStr: string) => {
        const filePath = Uri.parse(uriStr).fsPath;
        const terminal = window.createTerminal("CE: Runner");
        terminal.show();
        terminal.sendText(`ce run "${filePath}"`);
    });
    context.subscriptions.push(runCommand);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}