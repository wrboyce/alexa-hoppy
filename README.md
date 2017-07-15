# alexa-hoppy

Hoppy brings extensive beer knowledge to your Echo devices.

## Usage

This is my first forage into Alexa skill development, and I'm still not happy with the tooling or repository layout, it all feels a bit hacky/thrown together.

That being said, if you want to run/test locally something along these lines will see you straight:

* Install bespoken-tools globally (it doesn't seem to work when installed non-globally)
```bash
make global-dep
```

* Build/run code locally via `bst proxy` (note that you'll need to re-build after modifying typescript files)
```bash
make run
```

* Deploy the code to lambda via `bst deploy lambda`
```bash
make deploy
```

### Testing

I knew I forgot something.

## Code Organisation

Ha. "If the code was organised, would this section be necessary?" I hear you ask... And you're right. I kinda split still up and ended up with the layout we've got now. I don't like it but I can't dream up anything objectively better so there we have it.

`./index.ts` primarily concerns itself with launching the Lambda handler and setting up the Alexa SDK.

`./handlers.ts` is the meat-and-potatoes and the Alexa interaction

and `./utils.ts` is pretty much all the stuff that turns text into nice-sounding spoken words.

## Likely Questions

* Whats going on with the messy code organisation? **Two** `package.json` files *and* and `Makefile`?!

  - Well as I mentioned, I don't really know what I'm doing with the alexa tooling/sdk (lambda is pretty new too, if we're being honest). Also, they shouldn't put 8.5% beers in 660ml bottles.
  
* Hoppy is shit, it takes too long to respond!

  - I worry about this too, and I have some ideas cooking… Leave it with me.
  
## Unlikely Questions

* This looks great! Can I use help beta test/buy it/have your children?

  - Very possibly, drop me and email or get in touch [on twitter](https://twitter.com/wrboyce) and we'll sort something out.