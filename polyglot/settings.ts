export interface PolyglotSettings {
	awsAccessKeyId: string
	awsSecretAccessKey: string
	awsRegion: string
	voiceId: string
	pollyEngine: string
	speechPrepend: string
	speechAppend: string
}

export const DEFAULT_SETTINGS: PolyglotSettings = {
	awsAccessKeyId: '',
	awsSecretAccessKey: '',
	awsRegion: 'eu-west-3',
	voiceId: 'Joanna',
	pollyEngine: 'standard',
	speechPrepend: '',
	speechAppend: ''
}

