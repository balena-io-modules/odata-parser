import test from './test';
import './encoding';
import './resource_parsing';
import './stress';
// These tests take the test function as an argument so they can also be used in expand tests.
import expand from './expand';
import filterby from './filterby';
import format from './format';
import orderby from './orderby';
import paging from './paging';
import select from './select';
import count from './count';
expand(test);
filterby(test);
format(test);
orderby(test);
paging(test);
select(test);
count(test);
