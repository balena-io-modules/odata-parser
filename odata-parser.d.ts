export type SupportedMethod =
	| 'GET'
	| 'PUT'
	| 'POST'
	| 'PATCH'
	| 'MERGE'
	| 'DELETE'
	| 'OPTIONS';
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
export interface ExpandOption {
	properties: ExpandPropertyPath[];
}
export interface OrderByOption {
	properties: OrderByPropertyPath[];
}
export interface ODataOptions {
	$select?: SelectOption;
	$filter?: any;
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
		| ['Real', number]
		| ['Boolean', boolean]
		| ['Text', string]
		| ['Date' | 'Date Time', Date]
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
	opts?: { startRule: string; rule: string },
): {
	tree: ODataQuery;
	binds: ODataBinds;
};
