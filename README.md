# @enfo/env-vars
> A small package for parsing process.env according to a configuration of your choosing.

## Install

```
yarn add @enfo/env-vars
```

or

```
npm install @enfo/env-vars --save
```

## Basic Example

Load variables into process.env

```bash
export stage='test'
export importantValue='12.34'
```

Parse the variables by type

```typescript
import { parse, VariableType } from '@enfo/env-vars';

const config = parse[
  {
    name: 'stage',
    type: VariableType.STRING,
    regex: '^[a-z]*$'
  },
  {
    name: 'importantNumber',
    type: VariableType.NUMBER
  },
  {
    name: 'deploySatellite',
    type: VariableType.BOOLEAN,
    defaultValue: false
  }
];

console.log(config)
```

Output

```javascript
{
  stage: 'test',
  importantNumber: 12.34,
  deploySatellite: false
}
```

## Usage

To parse variables from process.env you specify an array of variables to be parsed. For each variable an object with key must be defined.

Required

 * name - name of the variable in process.env. For example process.env.stage would be referred to by 'stage'
 * type - the type to which the variable should be parsed

Optional

 * defaultValue - fallback value if the variable is undefined. Does not have to match type
 * required - if the variable is undefined and required is true an error will be thrown
 * regex - used to check if the value matches a regex. Mainly intended for string type variables

Conditional

 * enum - used for type enum to specify possible values. Array of values, can be of any type.

There are multiple different types as which a variable can be parsed. If the variable cannot be parsed to the type an Error will be thrown. In Typescript the type must be defined using VariableType. In javascript the strings below will suffice.

 * string
 * number
 * boolean
 * enum
 * json

## A few more examples

Parse required string with regex

```typescript
//process.env.awsAccountNumber = '1234-5678-9012';

const config = parse([
  {
    name: 'awsAccountNumber',
    type: VariableType.STRING,
    required: true,
    regex: '^\d{4}-\d{4}-\d{4}$'
  }
]);
```

Parse number with default value

```typescript
//process.env.someNumber = undefined;

const config = parse([
  {
    name: 'someNumber',
    type: VariableType.NUMBER,
    defaultValue: 4711
  }
]);
```

Parse enum

```typescript
//process.env.stage = 'test';

const config = parse([
  {
    name: 'stage',
    type: VariableType.ENUM,
    enum: ['dev', 'test', 'prod']
  }
]);
```

Parse JSON

```typescript
//process.env.anObject = '{"a": "b"}';

const config = parse([
  {
    name: 'anObject',
    type: VariableType.JSON
  }
]);
```

## License

@enfo/env-vars is licensed under the terms of the MIT license.