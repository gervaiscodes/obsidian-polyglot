export interface PolyglotSettings {
	awsAccessKeyId: string
	awsSecretAccessKey: string
	awsRegion: string
	voiceId: string
	pollyEngine: string
	speechPrepend: string
	speechAppend: string
	translateSource: string
	translateTarget: string
	translatePrepend: string
	translateAppend: string
}

export const DEFAULT_SETTINGS: PolyglotSettings = {
	awsAccessKeyId: '',
	awsSecretAccessKey: '',
	awsRegion: 'eu-west-3',
	voiceId: 'Joanna',
	pollyEngine: 'standard',
	speechPrepend: '',
	speechAppend: '',
	translateSource: 'en',
	translateTarget: 'fr',
	translatePrepend: '',
	translateAppend: ''
}

