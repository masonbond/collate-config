# collate-config

A utility that climbs the directory tree looking for and optionally combining JSON config files specified in parent modules/projects.

This allows you to change how a dependency builds or behaves depending on config hosted in your importing project (similar to how `.babelrc` and similar files work)

## Usage

```javascript
import collateConfig from 'collate-config';

const config = collateConfig('.yourmodulerc');
```

In this example `collate-config` will, starting from its own root dir, climb up the directory tree looking for a directory containing BOTH a `package.json` and a `.yourmodulerc` file.  If it finds one, it will parse the latter as JSON, `Object.assign` the result to a collection, and continue up the tree.  If it encounters another valid config directory, the properties from that `.yourmodulerc` will override the ones specified earlier by default.

For example, with the following files and directory structure:

### 
```javascript
// ~/parent-project/node_modules/some-dependency/.yourmodulerc
{
  "a": "I've just been defined!",
  "b": "Hey me too!"
}

/* ... */

// ~/parent-project/.yourmodulerc
{
  "b": "I've just been overridden!",
  "c": "I'm new around here."
}

/* ... */

// ~/parent-project/node_modules/some-dependency/index.js

import collateConfig from 'collate-config';

const config = collateConfig('.yourmodulerc');
/*
  config = {
    "a": "I've just been defined!",
    "b": "I've just been overridden!",
    "c": "I'm new around here."
  }
*/
```

## Sealing config to prevent unwanted overrides

By default `collate-config` will traverse up the entire directory tree until it hits the root.  To prevent this behavior you can "seal" any particular config file by defining the `__sealed` property in its JSON object with any truthy value.

For example, if we made the following edit to our above example:
```javascript
// ~/parent-project/node_modules/some-dependency/.yourmodulerc
{
  "__sealed": true,
  "a": "I've just been defined!",
  "b": "Hey me too!"
}
```

Then `collate-config` would stop after parsing this file and would NOT parse the `.yourmodulerc` file in `parent-project`'s root.  The final output would then be:

```javascript
{
  "__sealed": true,
  "a": "I've just been defined!",
  "b": "Hey me too!"
}
```
