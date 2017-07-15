import * as Alexa from 'alexa-sdk';

import {appHandlers, coreHandlers, easterEggs} from './handlers';

const ALEXA_APP_ID: string = process.env.ALEXA_APP_ID as string;

exports.handler = (event: Alexa.RequestBody<Alexa.Request> | any,
				   context: Alexa.Context,
				   callback?: (err: any, response: any) => void): void => {
	const alexa = Alexa.handler(event, context, callback);
	alexa.appId = ALEXA_APP_ID;
	// fix for stuff amazon broke...
	if (event.context && event.context.System.application.applicationId === 'applicationId') {
		event.context.System.application.applicationId = event.session.application.applicationId;
	}
	alexa.registerHandlers(coreHandlers, appHandlers, easterEggs);
	alexa.execute();
};
