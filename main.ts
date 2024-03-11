import { MarkdownView, Plugin } from 'obsidian'
import { PollyClient } from '@aws-sdk/client-polly'
import { PolyglotSettings, DEFAULT_SETTINGS } from 'polyglot/settings'
import SettingTab from 'polyglot/settings-tab'
import textToSpeech from 'polyglot/text-to-speech'

export default class Polyglot extends Plugin {
	settings: PolyglotSettings
	pollyClient: PollyClient

	async onload() {
		await this.loadSettings();

		this.pollyClient = new PollyClient({
			region: this.settings.awsRegion,
			credentials: {
				accessKeyId: this.settings.awsAccessKeyId,
				secretAccessKey: this.settings.awsSecretAccessKey
			},
		})

		this.addRibbonIcon('speech', 'Polly', (evt: MouseEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView)

			if (view) {
				textToSpeech(view.editor, this.settings, this.pollyClient)
			}
		});

		this.addCommand({
			id: 'polly-text-to-speech',
			name: 'Convert text to speech',
			editorCallback: (editor, view) => textToSpeech(editor, this.settings, this.pollyClient)
		})

		this.addSettingTab(new SettingTab(this.app, this))
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
