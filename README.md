# @enfo/env-vars
> A small package for parsing process.env according to a configuration of your choosing.

## Installation

```
npm install @enfo/env-vars --save
```

## Usage

Parse the variables by type

```typescript
import { parse, VariableType } from '@enfo/env-vars';

process.env.stage='test'
process.env.importantValue='12.34'

interface MyVariables {
  stage: string;
  importantNumber: number;
  deploySatellite: boolean;
}

const config = parse<MyVariables>({
  variables: [
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
  ]
});

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

## Configuration

To parse variables from process.env you specify an array of variables to be parsed. For each variable an object with a unique key must be defined. If you are using Typescript a type can be passed in order to cast the created object to a desired type. If the type matches the output is not validated in any manner.

The package supports four different types of variable formats.

* string
* number
* boolean
* json

## Variable configuration

The following parameters are available on all variable configurations.

* name - name of the variable in process.env. For example process.env.stage would be referred to as 'stage'
* type - the type to which the variable should be parsed
* defaultValue - optional default value to use if no value is found in process.env
* required - optional flag to set to throw if the value could not be found. If set defaultValue gets ignored.

### String variable configuration

String variable configuration exposes an additional parameter.

* regex - optional regular expression as string or Regexp. If set it will be used to validate that the environmental variable matches the desired format. If set then the variable is considered required by default.

Configuration examples:

```typescript
{
  type: VariableType.STRING,
  name: 'stage',
  defaultValue: 'prod'
};
```

```typescript
{
  type: VariableType.STRING,
  name: 'stage',
  regex: '/^[a-z]{3,5}$/'
};
```

### Numerical variable configuration

Numerical variables expose no extra configurable parameters. Configuration examples:

```typescript
{
  type: VariableType.NUMBER,
  name: 'age',
  defaultValue: 42
};
```

```typescript
{
  type: VariableType.STRING,
  name: 'age',
  required: true
};
```

### Boolean variable configuration

Boolean variables are parsed to true/false based on an internal array of strings that are considered truthy. They also expose a parameter which can be used to add additional types of truthy values.

* truthyValues - optional parameter where you can pass an array of strings which are considered truthy

The following values are considered truthy:

* 'true'
* '1'
* 'yes'

Configuration examples:

```typescript
{
  type: VariableType.BOOLEAN,
  name: 'deploySatellite',
  defaultValue: false
};
```

```typescript
{
  type: VariableType.BOOLEAN,
  name: 'deploySatellite',
  truthyValues: ['yarp', 'yup']
};
```

### JSON variable configuration

No extra parameters are available for JSON variables. The data being parsed should be stringified JSON, for example:

```typescript
process.env.fancyData = JSON.stringify({b: 42})
```

Or in an environment variable file:

```yml
fancyData: '{"b":42}'
```

Configuration examples:

```typescript
{
  type: VariableType.JSON,
  name: 'fancyData',
  defaultValue: { a: 4711 }
};
```

```typescript
{
  type: VariableType.JSON,
  name: 'fancyData',
  required: true
};
```

## License

@enfo/env-vars is licensed under the terms of the MIT license.
