import * as Alexa from 'alexa-sdk';
import * as _ from 'lodash';

import Utils from './utils';

function isSlotValid(request: Alexa.IntentRequest, slotName: string): boolean {
	// const beerName = this.event.request.intent.slots.BeerName.value;
	const slot = request.intent!.slots[slotName];
	return slot && slot.value;
}

export const coreHandlers: Alexa.Handlers<Alexa.Request> = {
	// tslint:disable-next-line:no-empty
	'AMAZON.CancelIntent'() {},
	// tslint:disable-next-line:no-empty
	'AMAZON.HelpIntent'() {},
	// tslint:disable-next-line:no-empty
	'AMAZON.StopIntent'() {},

	// tslint:disable-next-line:no-empty
	'Unhandled'() {},
};

export const appHandlers: Alexa.Handlers<Alexa.IntentRequest> = {
	GetBeerInfo() {
		if (!isSlotValid(this.event.request, 'BeerName')) {
			// tslint:disable-next-line:no-console
            console.log('BeerName slot is empty, bailing');
			return;
		}

		const beerName = this.event.request.intent!.slots.BeerName.value;
		Utils.getBeer(beerName).then((beer) => {
			// $brewery's $beer is
			const response = [Utils.spokenIntro(beer)];
			// a[n] $abv%
			response.push(Utils.spokenABV(beer, true));
			// $style with an average rating of $rating.
			response.push(`${Utils.spokenStyle(beer)} with an average rating of ${Utils.spokenRating(beer)}.`);
			// Followed by the brewer's description from untappd
			response.push(Utils.spokenDesc(beer));
			this.emit(':tell', Utils.spokenify(response));
		}).catch((err) => {
			console.error(err);
			this.emit(':tell', 'Sorry, something went wrong looking up that beer.');
		});
	},

	GetBeerABV() {
		if (!isSlotValid(this.event.request, 'BeerName')) {
			// tslint:disable-next-line:no-console
			console.log('BeerName slot is empty, bailing');
			return;
		}

		const beerName = this.event.request.intent!.slots.BeerName.value;
		Utils.getBeer(beerName).then((beer) => {
			// $brewery's $beer is %abv%.
			this.emit(':tell', Utils.spokenify(`${Utils.spokenIntro(beer)} ${Utils.spokenABV(beer)}.`));
		}).catch((err) => {
			console.error(err);
			this.emit(':tell', 'Sorry, something went wrong looking up that beer.');
		});
	},

	GetBeerStyle() {
		if (!isSlotValid(this.event.request, 'BeerName')) {
			// tslint:disable-next-line:no-console
			console.log('BeerName slot is empty, bailing');
			return;
		}

		const beerName = this.event.request.intent!.slots.BeerName.value;
		Utils.getBeer(beerName).then((beer) => {
			// $brewery's $beer is a[n] $style.
			this.emit(':tell', Utils.spokenify(`${Utils.spokenIntro(beer)} ${Utils.spokenStyle(beer, true)}.`));
		}).catch((err) => {
			console.error(err);
			this.emit(':tell', 'Sorry, something went wrong looking up that beer.');
		});
	},
};

export const easterEggs: Alexa.Handlers<Alexa.Request> = {
	BeerTime() {
		this.emit(':tell', "It's time for a beer!");
	},

	NoBeerOhDear() {
		const responses = [
			'<say-as interpret-as="interjection">Aw man!</say-as> So, pub or shop?',
			'<say-as interpret-as="interjection">Blimey!</say-as> That\'s not good.',
		];
		this.emit(':tell', _.sample(responses));
	},

	ImDrunk() {
		const responses = [
			'<say-as interpret-as="interjection">Roger.</say-as>',
			'<say-as interpret-as="interjection">Well done!</say-as>',
			'<say-as interpret-as="interjection">Woo hoo!</say-as>',
		];
		this.emit(':tell', _.sample(responses));
	},
};
