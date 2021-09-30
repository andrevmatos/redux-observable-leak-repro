# Reproduction for nodejs redux-observable memory leak issue

### Requirements
- NodeJS 14.x
- yarn 1.x

### To test:
```sh
yarn
yarn build
node --inspect-brk index.js
```

- Then open Chrome/Chromium browser in `chrome://inspect`, and click on `inspect` on the local target
- On `Sources` tab, press F8 to proceed
- On `Memory` tab, take a `Heap snapshot`
  - Check the several thousands `QueueAction`s created and not freed, all of them retained by a few `OperatorSubscriber`s
  - Several `Context`, `(closure)` and `(concatenated string)` which were all already handled are also retained in memory by the `QueueAction`'s `worker` property
