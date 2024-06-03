export type SupportedMethod =
	| 'GET'
	| 'PUT'
	| 'POST'
	| 'PATCH'
	| 'MERGE'
	| 'DELETE'
	| 'OPTIONS';

/**
 * string for a parameter alias reference, number for an extracted constant
 */
export type BindKey = `@${string}` | number;
export type BindReference = { bind: BindKey };

export type NumberBind = ['Real', number];
export type BooleanBind = ['Boolean', boolean];
export type TextBind = ['Text', string];
export type DateBind = ['Date' | 'Date Time', Date];

export interface ResourceOptions {
	count?: true;
	options?: ODataOptions;
}

interface GenericPropertyPath<T = any> {
	name: string;
	property?: T;
}
export type PropertyPath = GenericPropertyPath<PropertyPath>;
export interface OrderByPropertyPath
	extends GenericPropertyPath<OrderByPropertyPath> {
	order: 'asc' | 'desc';
}
export interface ExpandPropertyPath
	extends GenericPropertyPath<ExpandPropertyPath>,
		ResourceOptions {}
export type SelectOption =
	| '*'
	| {
			properties: PropertyPath[];
	  };
export type FilterOption = any;
export interface ExpandOption {
	properties: ExpandPropertyPath[];
}
export interface OrderByOption {
	properties: OrderByPropertyPath[];
}
export type FormatOption =
	| string
	| {
			type: string;
			metadata: 'none' | 'minimal' | 'full';
	  };
export interface ODataOptions {
	$select?: SelectOption;
	$filter?: FilterOption;
	$expand?: ExpandOption;
	$orderby?: OrderByOption;
	$top?: number;
	$skip?: number;
	$count?: boolean;
	$inlinecount?: string;
	$format?: FormatOption;

	[key: string]: // User defined options, do not start with $ or @
	| string
		// Parameter aliases (start with @)
		| NumberBind
		| BooleanBind
		| TextBind
		| DateBind
		// known $ options
		| SelectOption
		| ExpandOption
		| OrderByOption
		| FormatOption
		| number
		| boolean
		| undefined;
}
export interface ODataQuery extends ResourceOptions {
	resource: any;
	key?:
		| BindReference
		| {
				[resourceName: string]: BindReference;
		  };
	link?: any;
	property?: any;
}
export interface ODataBinds extends Array<[type: string, value: any]> {
	[key: `@${string}`]: [type: string, value: any];
}

export class SyntaxError extends Error {}
export function parse(
	url: string,
	opts?: { startRule: 'ProcessRule'; rule: 'OData' },
): {
	tree: ODataQuery;
	binds: ODataBinds;
};
export function parse(
	url: string,
	opts?: { startRule: 'ProcessRule'; rule: 'KeyBind' },
): {
	tree: BindReference;
	binds: ODataBinds;
};
export function parse(
	url: string,
	opts?: { startRule: 'ProcessRule'; rule: 'FilterByExpression' },
): {
	tree: FilterOption;
	binds: ODataBinds;
};
export function parse(
	url: string,
	opts?: { startRule: 'ProcessRule'; rule: 'QueryOptions' },
): {
	tree: ODataOptions;
	binds: ODataBinds;
};
export function parse(
	url: string,
	opts?: { startRule: 'ProcessRule'; rule: string },
): {
	tree: any;
	binds: ODataBinds;
};
