# kifuParser.js

kif, ki2, and csa data format into JSON or JavaScript Object

## Kifu Format of JSON

{

* header[object]
	* date[object]
		* start[string]
		* end[string]
	* site[string]
	* handicap[number]
	* title[string]
	* moves[number]
	* event[string]
	* opening[string]
	* result[number]
	* board[array]
	* turn[boolean]
	* time[object]
		* limit[string]
		* used[object]
			* black[string]
			* white[string]
	* tactics[object]
		* black[string]
		* white[string]
	* players[object]
		* black[string]
		* white[string]
	* hands[object]
		* black[object]
		* white[object]
* sources[array]
	* [object]
		* comment[string]
	* [object]
		* comment[string]
		* id[typeless]
		* move[object]
			* turn[boolean]
			* from[array]
			* to[array]
			* piece[number]
	    * time[number]
		* variations[array]
			* [array]
				* [object]
				* .
				* .
			* [array]
				* [object]
				* [object]
				* .
				* .
	* [object]
		* comment[string]
		* id[typeless]
		* move[object]
			* turn[boolean]
			* from[array]
			* to[array]
			* piece[number]
		* time[number]
		* variations[array]
			* [array]
				* [object]
				* .
				* .
			* [array]
				* [object]
				* .
				* .
	* [object]
		* special[string]

}

## Usage

```js
kifuParser(source, format, json);
```

* source
	* Type: String
	* kif, ki2, and csa text
* format
	* Type: String
	* set source data Format(```'Kif'```, ```'Ki2'```, and ```'Csa'```)
	* if format is not set, automatic determination
* json
	* Type: Boolean
	* if you set ```true```: export JSON
	* if you set ```false```: export JavaScript Object

### Browser:

```html
<script src="kifuParser-x.x.x.min.js"></script>
<script>
// example source
var kif = '1 ７六歩(77)   ( 0:01/00:00:01)\n' +
          '2 ３四歩(33)   ( 0:01/00:00:01)';

// export JavaScript Object
var jo = kifuParser(kif, 'Kif', false);

// export JSON
var json = kifuParser(kif, 'Kif', true);
</script>
```

### Node:

#### installation
```sh
npm install kifu-parser --save-dev
```

#### example
```js
var kifuParser = require('kifu-parser');

// example source
var kif = '1 ７六歩(77)   ( 0:01/00:00:01)\n' +
          '2 ３四歩(33)   ( 0:01/00:00:01)';


// export JavaScript Object
var jo = kifuParser(kif, 'Kif', false);

// export json
var json = kifuParser(kif, 'Kif', true);
```

## Licence

MIT

## Author

[sandai](https://github.com/sandai)
