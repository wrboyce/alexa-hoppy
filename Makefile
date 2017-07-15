dep:
	npm install --only=dev

global-dep:
	npm install -g bespoken-tools

lint: dep
	./node_modules/.bin/tslint --project .

build: dep
	./node_modules/.bin/tsc --project .

install-dist: build
	cd dist; npm install

uninstall-dist:
	rm -rf dist/node_modules

run: build install-dist
	cd dist; bst proxy lambda index.js --verbose

deploy: lint uninstall-dist build
	bst deploy lambda --verbose --lambdaName alexa-hoppy dist

clean: uninstall-dist
	rm -f dist/*.js

.PHONY: dep global-dep lint build install-dist uninstall-dist run deploy clean
