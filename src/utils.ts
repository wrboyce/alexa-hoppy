import * as Bluebird from 'bluebird';
import * as _ from 'lodash';

import * as Untappd from './untappd';

const UNTAPPD_CLIENT_ID: string = process.env.UNTAPPD_CLIENT_ID as string,
	  UNTAPPD_CLIENT_SECRET: string = process.env.UNTAPPD_CLIENT_SECRET as string,
	  untappd = new Untappd.API(UNTAPPD_CLIENT_ID, UNTAPPD_CLIENT_SECRET);

const Utils = {
	// 8, 11, 18, 80-89 should be spoken with "an" ("…an eleven percent…")
	abvHasN: (beer: Untappd.Beer): boolean => !!String(beer.beer_abv).match(/^(8\d+|11|18)(\.\d+)?/),

	getBeer: (beerName: string): Bluebird<Untappd.Beer> => {
		// return SimpleDB.getBeer(beerName).catch(() => {
		return untappd.getBeerByName(beerName).then((beer: Untappd.Beer) => {
			// SimpleDB.putBeer(beerName, beer);
			return beer;
		});
		// })
	},

	spokenABV: (beer: Untappd.Beer, withPrefix: boolean = false): string => {
		let response = `${beer.beer_abv}%`;
		if (withPrefix) {
			let prefix = 'a';
			if (Utils.abvHasN(beer)) {
				prefix = 'an';
			}
			response = `${prefix} ${response}`;
		}
		return response;
	},

	spokenDesc: (beer: Untappd.Beer): string => beer.beer_description.replace(/\n/g, ' '),

	spokenIntro: (beer: Untappd.Beer): string => `${beer.brewery.brewery_name}'s ${beer.beer_name} is`,

	// Round the average rating to 1 decimal place
	spokenRating: (beer: Untappd.Beer): string => (Math.round(beer.weighted_rating_score * 10) / 10).toFixed(1),

	// Untappd displays styles as "IPA - American" which is better spoken as "American IPA"
	spokenStyle: (beer: Untappd.Beer, withPrefix: boolean = false): string => {
		let response = beer.beer_style;
		if (response.indexOf(' - ') > -1) {
			const beerStyles = response.split(' - ');
			response = `${beerStyles[1]} ${beerStyles[0]}`;
		}
		if (withPrefix) {
			let prefix = 'a';
			if (response.match(/^[aeiou].*/i)) {
				prefix = 'an';
			}
			response = `${prefix} ${response}`;
		}
		return response;
	},

	// markup speech so that Alexa doesn't try and pronounce abbreviations like "IPA"
	spokenify: (input: string | string[]): string => {
		let s: string;
		if (_.isArray(input)) {
			s = (input as string[]).join(' ');
		} else {
			s = input as string;
		}
		const asLetters = ['APA', 'IPA'];
		for (const word of asLetters) {
			const rx = new RegExp(`\\b${word}\\b`, 'ig');
			s = s.replace(rx, `<say-as interpret-as="characters">${word}</say-as>`);
		}
		return s;
	},
};

export default Utils;
