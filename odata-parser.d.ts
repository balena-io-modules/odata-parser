export type SupportedMethod =
	| 'GET'
	| 'PUT'
	| 'POST'
	| 'PATCH'
	| 'MERGE'
	| 'DELETE'
	| 'OPTIONS';

export type NumberBind = ['Real', number];
export type BooleanBind = ['Boolean', boolean];
export type TextBind = ['Text', string];
export type DateBind = ['Date' | 'Date Time', Date];
export interface PropertyPath {
	name: string;
	property?: PropertyPath;
}
export interface OrderByPropertyPath extends PropertyPath {
	order: 'asc' | 'desc';
}
export interface ExpandPropertyPath extends PropertyPath {
	count?: true;
	options: ODataOptions;
}
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
export interface ODataOptions {
	$select?: SelectOption;
	$filter?: FilterOption;
	$expand?: ExpandOption;
	$orderby?: OrderByOption;
	$top?: number;
	$skip?: number;
	$count?: boolean;
	$inlinecount?: string;
	$format?: string;

	[key: string]:  // User defined options, do not start with $ or @
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
		| number
		| boolean;
}
export interface ODataQuery {
	resource: any;
	key?: any;
	link?: any;
	property?: any;
	count?: true;
	options?: ODataOptions;
}
export interface ODataBinds extends Array<any> {
	[key: string]: any;
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
	tree: { bind: string };
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
	opts?: { startRule: 'ProcessRule'; rule: string },
): {
	tree: any;
	binds: ODataBinds;
};
