import { App, PluginSettingTab, Setting, DropdownComponent } from 'obsidian'
import pollyVoices from './voices.json'
import awsRegions from './aws-regions.json'
import Polyglot from 'main'

export default class SettingTab extends PluginSettingTab {
	plugin: Polyglot

	constructor(app: App, plugin: Polyglot) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		const addOptionsToVoicesDropdown = (dropDown: DropdownComponent) => {
			for(const pollyVoice of pollyVoices) {
				const label = `${pollyVoice['LanguageName']} - ${pollyVoice['Name']} (${pollyVoice['SupportedEngines'].join(', ')})`
				dropDown.addOption(pollyVoice['Id'], label)
			}
			dropDown.setValue(this.plugin.settings.voiceId)
			dropDown.onChange((value: string) => {
				this.plugin.settings.voiceId = value
				this.plugin.saveData(this.plugin.settings)
			})
			return dropDown
		}

		const addOptionsToAwsRegionsDropdown = (dropDown: DropdownComponent) => {
			for(const awsRegion of awsRegions) {
				dropDown.addOption(awsRegion, awsRegion)
			}
			dropDown.setValue(this.plugin.settings.awsRegion)
			dropDown.onChange((value: string) => {
				this.plugin.settings.voiceId = value
				this.plugin.saveData(this.plugin.settings)
			})
			return dropDown
		}

		new Setting(containerEl)
			.setName('AWS Access Key ID')
			.setDesc('Reload required for changes to take effect.')
			.addText(text => text
				.setValue(this.plugin.settings.awsAccessKeyId)
				.onChange(async (value) => {
					this.plugin.settings.awsAccessKeyId = value
					await this.plugin.saveSettings()
				}));

		new Setting(containerEl)
			.setName('AWS Secret Key')
			.setDesc('Reload required for changes to take effect.')
			.addText(text => text
				.setValue(this.plugin.settings.awsSecretAccessKey)
				.onChange(async (value) => {
					this.plugin.settings.awsSecretAccessKey = value
					await this.plugin.saveSettings()
				}))

		new Setting(containerEl)
			.setName('AWS Region')
			.addDropdown(dropDown => addOptionsToAwsRegionsDropdown(dropDown))

		new Setting(containerEl)
			.setName('Voice ID')
			.addDropdown(dropDown => addOptionsToVoicesDropdown(dropDown))

		new Setting(containerEl)
			.setName('Polly Engine')
			.addDropdown(dropDown => dropDown
				.addOption('standard', 'standard')
				.addOption('neural', 'neural')
				.addOption('long-form', 'long-form')
				.setValue(this.plugin.settings.pollyEngine)
				.onChange((value: string) => {
					this.plugin.settings.pollyEngine = value;
					this.plugin.saveData(this.plugin.settings)
				}))

		new Setting(containerEl)
			.setName('Text to add before speech file')
			.addTextArea(text => text
				.setValue(this.plugin.settings.speechPrepend)
				.onChange(async (value) => {
					this.plugin.settings.speechPrepend = value
					await this.plugin.saveSettings()
				}))

		new Setting(containerEl)
			.setName('Text to add after speech file')
			.addTextArea(text => text
				.setValue(this.plugin.settings.speechAppend)
				.onChange(async (value) => {
					this.plugin.settings.speechAppend = value
					await this.plugin.saveSettings()
				}))
	}
}
