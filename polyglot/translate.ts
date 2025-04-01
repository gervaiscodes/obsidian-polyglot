import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { Editor, Notice } from 'obsidian';
import { PolyglotSettings, ClipboardUse } from './settings';

export default async function translate(editor: Editor, settings: PolyglotSettings, translateClient: TranslateClient, clipboardUse: ClipboardUse) {
	let selectedText;

	if (clipboardUse === ClipboardUse.Yes) {
		selectedText = await navigator.clipboard.readText();
	} else {
		selectedText = editor.getSelection();
	}

	if (!selectedText) {
		new Notice('No text selected!');
		return;
	}

	// Cleanup the text
	selectedText = selectedText.replace(/\[\[/g, '').replace(/\]\]/g, '');

	const params = {
		Text: selectedText,
		SourceLanguageCode: settings.translateSource,
		TargetLanguageCode: settings.translateTarget
	};

	const command = new TranslateTextCommand(params);

	try {
		const data = await translateClient.send(command);

		editor.replaceSelection(
			`${editor.getSelection()}${settings.translatePrepend}${data.TranslatedText}${settings.translateAppend}`
		);
	} catch (error) {
		new Notice(error);
	}
}
