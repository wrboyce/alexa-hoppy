import * as Bluebird from 'bluebird';
import * as qs from 'query-string';
import * as rp from 'request-promise';

export class API {
	private readonly baseUrl: string = 'https://api.untappd.com/v4';

	public constructor(private readonly clientId: string, private readonly clientSecret: string) {}

	public beerSearch(query: any): Bluebird<Beer[]> {
		return this.GET('search/beer', query).then((data: APIBeerSearchData) => data.beers.items).then((results) => {
			if (results.length === 0) {
				throw new Error('no results');
			}
			return results.map((result) => Object.assign({}, result.beer, {brewery: result.brewery}));
		});
	}

	public beerInfo(beerId: number): Bluebird<Beer> {
		return this.GET(`beer/info/${beerId}`, {compact: true}).then((data: APIBeerInfoData) => data.beer);
	}

	public getBeerByName(beerName: string): Bluebird<Beer> {
		// tslint:disable-next-line:no-console
		console.log(`getBeerByName: ${beerName}`);
		return this.beerSearch({q: beerName}).then((beers) => this.beerInfo(beers[0].bid));
	}

	protected GET(path: string, params?: any): Bluebird<APIBeerSearchData | APIBeerInfoData> {
		let uri = `${this.baseUrl}/${path}?client_id=${this.clientId}&client_secret=${this.clientSecret}`;
		if (params) {
			uri = `${uri}&${qs.stringify(params)}`;
		}
		const req = rp({uri, json: true});
		return req.then((data: APIResponse) => {
			if (data.meta.code !== 200) {
				throw new Error('api error');
			}
			return data.response;
		});
	}
}

interface APIResponse {
	meta: APIMeta;
	response: APIBeerSearchData | APIBeerInfoData;
}

interface APIMeta {
	code: number;
}

interface APIBeerSearchData {
	beers: {
		count: number,
		items: Array<{
			beer: Beer,
			brewery: Brewery,
		}>,
	};
}

interface APIBeerInfoData {
	beer: Beer;
}

export interface Beer {
	bid: number;
	beer_name: string;
	beer_label: string;
	beer_abv: number;
	beer_ibu: number;
	beer_description: string;
	beer_style: string;
	is_in_production: boolean;
	beer_slug: string;
	is_homebrew: boolean;
	created_at: Date;
	rating_count: number;
	rating_score: number;
	weighted_rating_score: number;

	brewery: Brewery;
}

export interface Brewery {
	brewery_id: number;
	brewery_name: string;
	brewery_label: string;
	country_name: string;
	brewery_active: boolean;
}
