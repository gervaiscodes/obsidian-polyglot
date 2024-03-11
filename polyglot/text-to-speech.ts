import { getSynthesizeSpeechUrl, PresignedPollyInput } from '@aws-sdk/polly-request-presigner'
import { fileNameCompatibleDate } from 'polyglot/utils'
import { PollyClient, SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly'
import { Editor, Notice } from 'obsidian'
import { PolyglotSettings } from './settings'

export default async function textToSpeech(editor: Editor, settings: PolyglotSettings, pollyClient: PollyClient) {
	const selectedText = editor.getSelection()

	if (!selectedText) {
		new Notice('No text selected!')
		return
	}

	if (!settings.awsAccessKeyId || !settings.awsSecretAccessKey) {
		new Notice('AWS keys are not set! Go to Polyglot settings to set them')
		return
	}

	const params = {
		Text: selectedText,
		OutputFormat: 'mp3',
		VoiceId: settings.voiceId,
		Engine: settings.pollyEngine
	} as SynthesizeSpeechCommandInput

	const input = {
		client: pollyClient,
		params: params
	} as PresignedPollyInput

	const signer = await getSynthesizeSpeechUrl(input)
	const fileName = `Polyglot-${fileNameCompatibleDate()}.mp3`
	const availablePath = await this.app.fileManager.getAvailablePathForAttachment(fileName)

	try {
		const response = await fetch(signer.toString())

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const buffer = await response.arrayBuffer()

		await app.vault.createBinary(availablePath, buffer)

		editor.replaceSelection(
			`${editor.getSelection()}${settings.speechPrepend}![](${fileName})${settings.speechAppend}`
		)
	} catch (error) {
		new Notice(error)
	}
}
