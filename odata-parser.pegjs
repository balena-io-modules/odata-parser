{
	var methods = {
		cast: [ 1, 2 ],
		ceiling: 1,
		concat: 2,
		contains: 2,
		date: 1,
		day: 1,
		endswith: 2,
		floor: 1,
		fractionalseconds: 1,
		hour: 1,
		indexof: 2,
		isof: [ 1, 2 ],
		length: 1,
		maxdatetime: 0,
		mindatetime: 0,
		minute: 1,
		month: 1,
		now: 0,
		replace: 3,
		round: 1,
		second: 1,
		startswith: 2,
		substringof: 2,
		substring: [ 2, 3 ],
		time: 1,
		tolower: 1,
		totaloffsetminutes: 1,
		totalseconds: 1,
		toupper: 1,
		trim: 1,
		year: 1
	};

	var operatorPrecedence = {
		or: 0,
		and: 0,
		eq: 1,
		ne: 1,
		gt: 1,
		ge: 1,
		lt: 1,
		le: 1,
		sub: 2,
		add: 3,
		mod: 4,
		div: 5,
		mul: 6
	};

	// v4 operator precedence
	// var operatorPrecedence = {
	// 	or: 0,
	// 	and: 1,
	// 	eq: 2,
	// 	ne: 2,
	// 	gt: 3,
	// 	ge: 3,
	// 	lt: 3,
	// 	le: 3,
	// 	add: 4,
	// 	sub: 4,
	// 	mul: 5,
	// 	div: 5,
	// 	mod: 5
	// };

	var binds = [];
	var precedence = 0;
	function reset() {
		binds = [];
		precedence = 0;
	};

	function ParseOptionsObject(options) {
		var optionsObj = {};
		for(var i in options) {
			optionsObj[options[i].name] = options[i].value;
		}
		return optionsObj;
	};

	function Bind(type, value) {
		binds.push([type, value])
		return { bind: binds.length - 1 }
	}
}

Process =
	&{reset(); return true;}
	tree:OData
	{ return { tree: tree, binds: binds } }

ProcessRule =
	'' {
		reset();
		var tree = eval(`peg$parse${options.rule}()`);
		return {
			tree,
			binds
		}
	}

OData =
		model:PathSegment
		{ return model }
	/	'/$metadata'
		{ return { resource: '$metadata' } }
	/	'/'
		{ return { resource: '$serviceroot' } }

QueryOptions =
	'?'
	option:QueryOption
	options:(
		'&'
		x:QueryOption
		{ return x }
	)*
	{ return ParseOptionsObject([option].concat(options)) }

QueryOption =
		(	'$'
		/	'%24'
		)
		x:(	SelectOption
		/	FilterByOption
		/	ExpandOption
		/	SortOption
		/	TopOption
		/	SkipOption
		/	CountOption
		/	InlineCountOption
		/	FormatOption
		)
		{ return x }
	/	OperationParam
	/	ParameterAliasOption

ParameterAliasOption =
	'@' name:Text '='
	value:(
		n:Number
		{ return [ 'Real', n ] }
	/	b:Boolean
		{ return [ 'Boolean', b ] }
	/	s:QuotedText
		{ return [ 'Text', s ] }
	/	Date
	)
	&{ return !binds['@' + name] }
	{ return binds['@' + name] = value }

OperationParam =
	name:Text '=' value:Text
	{ return { name: name, value: value } }

SortOption =
	'orderby='
	property:SortProperty
	properties:(
		','
		x:SortProperty
		{ return x }
	)*
	{ return { name: '$orderby', value: { properties: [property].concat(properties) } } }

SortProperty =
	property:PropertyPath
	spaces
	order:(
		'asc'
	/	'desc'
	/	'' { return 'desc' }
	)
	{
		property.order = order;
		return property
	}

TopOption =
	'top='
	value:UnsignedInteger
	{ return { name: '$top', value: value } }

SkipOption =
	'skip='
	value:UnsignedInteger
	{ return { name: '$skip', value: value } }

InlineCountOption =
	'inlinecount='
	value:(
		'allpages'
	/	'none'
	/	Text { return '' }
	)
	{ return { name: '$inlinecount', value: value } }

CountOption =
	'count='
	value:Boolean
	{ return { name: '$count', value: value } }

ExpandOption =
	'expand='
	properties:ExpandPropertyPathList
	{ return { name: '$expand', value: { properties: properties } } }

SelectOption =
	'select='
	value:(
		'*'
	/	properties:PropertyPathList
		{ return { properties: properties } }
	)
	{ return { name: '$select', value: value } }


FilterByOption =
	'filter='
	expr:FilterByExpression
	{ return { name: '$filter', value: expr } }

FormatOption =
	'format='
	type:ContentType
	{ return { name: '$format', value: type } }

FilterByExpression =
	('' {
		precedence = 0;
	})
	expr:FilterByExpressionLoop
	{ return expr }

FilterByExpressionLoop =
	minPrecedence:(
		'' {
			return precedence;
		}
	)
	expr:(
		lhs:(
			x:FilterByValue
			{ return [x] }
		)

		(	op:FilterByOperand
			&{
				precedence = operatorPrecedence[op] + 1
				return precedence > minPrecedence
			}

			rhs:FilterByExpressionLoop
			{
				if (Array.isArray(lhs[0]) && op == lhs[0][0]) {
					lhs[0] = [ op ].concat(lhs[0].slice(1), [rhs]);
				} else {
					lhs[0] = [ op, lhs[0], rhs ];
				}
			}
		/	spaces op:'in' spaces
			rhs:GroupedPrimitive
			{lhs[0] = [ op, lhs[0], rhs ]}
		)*
		{ return lhs[0] }
	/	&{return minPrecedence > 0}
		{
			precedence = 0;
			return peg$parseFilterByExpressionLoop()
		}
	)
	{ return expr }

FilterByValue =
	GroupedPrecedenceExpression
/	FilterMethodCallExpression
/	FilterNegateExpression
/	ParameterAlias
/	Primitive

Primitive =
		'(' spaces expr:Primitive spaces ')'
		{ return expr}
	/	QuotedTextBind
	/	NumberBind
	/	BooleanBind
	/	Null
	/	DateBind
	/	Duration
	/	LambdaPropertyPath
	/	PropertyPath

GroupedPrecedenceExpression =
	'(' spaces expr:FilterByExpression spaces ')'
	{ return expr }

FilterByOperand =
	spaces
	op:(
		'eq'
	/	'ne'
	/	'gt'
	/	'ge'
	/	'lt'
	/	'le'
	/	'and'
	/	'or'
	/	'sub'
	/	'add'
	/	'mod'
	/	'div'
	/	'mul'
	)
	spaces
	{ return op }

FilterNegateExpression =
	spaces
	'not'
	spaces
	value:(
		FilterByValue
	/	'(' spaces expr:FilterByExpression spaces ')'
		{ return expr }
	)
	{ return [ 'not', value ] }

GroupedPrimitive =
	'(' spaces
		first:Primitive
		rest:(
			','
			spaces
			x:Primitive
			{ return x}
		)*
	')'
	{ return [ first ].concat(rest) }


FilterMethodCallExpression =
	methodName:(
		'cast'
	/	'ceiling'
	/	'concat'
	/	'contains'
	/	'date'
	/	'day'
	/	'endswith'
	/	'floor'
	/	'fractionalseconds'
	/	'hour'
	/	'indexof'
	/	'isof'
	/	'length'
	/	'maxdatetime'
	/	'mindatetime'
	/	'minute'
	/	'month'
	/	'now'
	/	'replace'
	/	'round'
	/	'second'
	/	'startswith'
	/	'substringof'
	/	'substring'
	/	'time'
	/	'tolower'
	/	'totaloffsetminutes'
	/	'totalseconds'
	/	'toupper'
	/	'trim'
	/	'year'
	)
	'('
		spaces
		args:(
			first:FilterByExpression
			rest:(
				spaces
				','
				spaces
				x:FilterByExpression
				{ return x }
			)*
			spaces
			{ return [ first ].concat(rest) }
		/ '' { return [] }
		)
		&{ return args.length === methods[methodName] || (Array.isArray(methods[methodName]) && methods[methodName].includes(args.length)) }
	')'
	{ return [ 'call', { args: args, method: methodName } ] }

LambdaMethodCall =
	name:(
		'any'
	/	'all'
	)
	'('
		spaces
		identifier:ResourceName
		':'
		expression:FilterByExpression
		spaces
	')'
	{ return { expression: expression, identifier: identifier, method: name } }

PropertyPathList =
	path:PropertyPath
	paths:(
		','
		x:PropertyPath
		{ return x }
	)*
	{ return [path].concat(paths) }
PropertyPath =
	resource:ResourceName
	property:(
		'/'
		x:PropertyPath
		{ return x }
	)?
	{ return { name: resource, property } }
ExpandPropertyPathList =
	path:ExpandPropertyPath
	paths:(
		','
		x:ExpandPropertyPath
		{ return x }
	)*
	{ return [path].concat(paths) }
ExpandPropertyPath =
	resource:ResourceName
	count:(
		'/$count'
		{ return true }
	)?
	optionsObj:(
		'('
		x:(	option:QueryOption
			options:(
				'&'
				x:QueryOption
				{ return x }
			)*
			{ return ParseOptionsObject([option].concat(options)) }
		/ '' { return {} }
		)
		')'
		{ return x }
	)?
	next:(
		'/'
		x:PropertyPath
		{ return x }
	)?
	{ return { name: resource, property: next, count: count, options: optionsObj} }

LambdaPropertyPath =
	resource:ResourceName
	'/'
	x:(	next:LambdaPropertyPath
		{ return { name: resource, property: next } }
	/	lambda:LambdaMethodCall
		{ return { name: resource, lambda: lambda } }
	)
	{ return x }
Key =
	'('
	key:KeyBind
	')'
	{ return key }
KeyBind =
		NumberBind
	/	QuotedTextBind
	/	ParameterAlias

Links =
	'/$links'
	link:SubPathSegment
	{ return link }

PathSegment =
	result:(
		'/'
		result:(
			resource: ResourceName
			{ return { resource } }
		)
		(
			(	key:Key
				{ result.key = key }
			)
			(	link:Links
				{result.link = link}
			/	property:SubPathSegment
				{result.property = property}
			)?
		/	'/$count'
			{result.count = true}
		)?
		{ return result }
	/	result:ContentReference
		(	link:Links
			{result.link = link}
		/	property:SubPathSegment
			{result.property = property}
		)?
		{ return result }
	)
	(	options:QueryOptions
		{result.options = options}
	)?
	{ return result }
SubPathSegment =
	'/'
	result:(
		resource: ResourceName
		{ return { resource } }
	)
	// Really this is only optional if the multiplicity from the previous segment to this segment is at most 1
	(	key:Key
		{ result.key = key }
	)?
	(	'/$links'
		link:SubPathSegment
		{result.link = link}
	/	property:SubPathSegment
		{result.property = property}
	)?
	('/$count'
		{result.count = true}
	)?
	(	options:QueryOptions
		{result.options = options}
	)?
	{ return result }

ContentType =
	$(	letter+
		'/'
		letter+
		('+' letter+)?
	)

ResourceName =
	// This regex is equivalent to `!(ReservedUriComponent / [ %])`
	resourceName:$[^:/?#\[\]@!$*&()+,;= %]+
	{ return decodeURIComponent(resourceName) }

Number =
		Decimal
	/	Integer

Decimal =
	sign:Sign
	d:$(
		digit+
		'.'
		digit+
	)
	{ return Number(sign + d) }

Integer =
	sign:Sign
	d:$(digit+)
	{ return parseInt(sign + d, 10) }

UnsignedInteger =
	d:$(digit+)
	{ return parseInt(d, 10) }

Null =
	'null'
	{ return null }

Boolean =
		'true'
		{ return true }
	/	'false'
		{ return false }

Duration =
	'duration'
	Apostrophe
	// Sign must appear first if it appears
	sign:Sign
	// P must always appear
	'P'
	// The order of elements is fixed (PnDTnHnMnS)
	day:(
		n:DurationInteger
		'D'
		{ return n }
	)?
	time:(
		// T must be present for time parts to be specified
		'T'
		hour:(
			n:DurationInteger
			'H'
			{ return n }
		)?
		minute:(
			n:DurationInteger
			'M'
			{ return n }
		)?
		second:(
			n:DurationNumber
			'S'
			{ return n }
		)?
		// If T is present there must be a time part
		&{return hour || minute || second}
		{
			return {
				hour: hour || undefined,
				minute: minute || undefined,
				second: second || undefined
			}
		}
	)?
	// There must be a duration part
	&{return day || time}
	Apostrophe
	{ return {
		negative: sign == '-',
		day: day || undefined,
		hour: time ? time.hour : undefined,
		minute: time ? time.minute : undefined,
		second: time ? time.second : undefined,
	} }
DurationInteger =
	UnsignedInteger

DurationNumber =
	(	d:$(
			digit+
			'.'
			digit+
		)
		{ return Number(d) }
	/	DurationInteger
	)

Text =
	// This regex is equivalent to `(!ReservedUriComponent)`
	text:$[^:/?#\[\]@!$*&()+,;=]*
	{ return decodeURIComponent(text) }

Sign =
		'+'
	/	'%2B'
		{ return '+' }
	/	'-'
	/	''

// TODO: This should really be done treating everything the same, but for now this hack should allow FF to work passably.
Apostrophe =
		'\''
	/	'%27'
		{ return '\'' }

QuotedText =
	Apostrophe
	text:(
		Apostrophe x:Apostrophe
		{ return x }
	/	!Apostrophe
		x:.
		{ return x }
	)*
	Apostrophe
	{ return decodeURIComponent(text.join('')) }

ParameterAlias =
	'@' param:ResourceName
	{ return { bind: '@' + param } }

NumberBind =
	n:Number
	{ return Bind('Real', n) }

Date =
	type:(
		'datetime'
		{ return 'Date Time' }
	/	'date'
		{ return 'Date' }
	)
	date:(
		date:QuotedText
		{ return Date.parse(date) }
	)
	!{ return isNaN(date) }
	{ return[type, date] }

DateBind =
	d:Date
	{ return Bind(d[0], d[1]) }

BooleanBind =
	b:Boolean
	{ return Bind('Boolean', b) }

ContentReference =
	'$'
	resource:ResourceName
	{
		var bind = Bind('ContentReference', resource)
		return { resource: bind, key: bind }
	}

QuotedTextBind =
	t:QuotedText
	{ return Bind('Text', t) }

spaces =
	(	' '
	/	'%20'
	)*

letter =
	[a-z]i

digit =
	[0-9]
