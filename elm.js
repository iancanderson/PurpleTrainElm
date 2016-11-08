
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		var name = v.func ? v.func.name : v.name;
		return '<function' + (name === '' ? '' : ':') + name + '>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$snd = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Basics$fst = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};
var _elm_lang$core$Basics$always = F2(
	function (a, _p8) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						_elm_lang$core$List_ops['::'],
						f(x),
						acc);
				}),
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? A2(_elm_lang$core$List_ops['::'], front, back) : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return A2(_elm_lang$core$List_ops['::'], _p10._0, xs);
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return A2(_elm_lang$core$List_ops['::'], x, y);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return A2(
						_elm_lang$core$List_ops['::'],
						A2(f, x, _p11._0),
						accAcc);
				} else {
					return _elm_lang$core$Native_List.fromArray(
						[]);
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				_elm_lang$core$Native_List.fromArray(
					[b]),
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return A2(_elm_lang$core$List_ops['::'], x, y);
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		_elm_lang$core$Native_List.fromArray(
			[]),
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: A2(_elm_lang$core$List_ops['::'], x, _p16),
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: A2(_elm_lang$core$List_ops['::'], x, _p15)
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_List.fromArray(
					[]),
				_1: _elm_lang$core$Native_List.fromArray(
					[])
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: A2(_elm_lang$core$List_ops['::'], _p19._0, _p20._0),
				_1: A2(_elm_lang$core$List_ops['::'], _p19._1, _p20._1)
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_List.fromArray(
				[]),
			_1: _elm_lang$core$Native_List.fromArray(
				[])
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		} else {
			var step = F2(
				function (x, rest) {
					return A2(
						_elm_lang$core$List_ops['::'],
						sep,
						A2(_elm_lang$core$List_ops['::'], x, rest));
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_p21._1);
			return A2(_elm_lang$core$List_ops['::'], _p21._0, spersed);
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = A2(_elm_lang$core$List_ops['::'], _p22._0, taken);
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				_elm_lang$core$Native_List.fromArray(
					[])));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return _elm_lang$core$Native_List.fromArray(
											[_p23._1._0, _p23._1._1._0]);
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return _elm_lang$core$Native_List.fromArray(
												[_p23._1._0, _p23._1._1._0, _p23._1._1._1._0]);
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? A2(
												_elm_lang$core$List_ops['::'],
												_p26,
												A2(
													_elm_lang$core$List_ops['::'],
													_p27,
													A2(
														_elm_lang$core$List_ops['::'],
														_p28,
														A2(
															_elm_lang$core$List_ops['::'],
															_p25,
															A2(_elm_lang$core$List$takeTailRec, n - 4, _p24))))) : A2(
												_elm_lang$core$List_ops['::'],
												_p26,
												A2(
													_elm_lang$core$List_ops['::'],
													_p27,
													A2(
														_elm_lang$core$List_ops['::'],
														_p28,
														A2(
															_elm_lang$core$List_ops['::'],
															_p25,
															A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)))));
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return _elm_lang$core$Native_List.fromArray(
					[_p23._1._0]);
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = A2(_elm_lang$core$List_ops['::'], value, result),
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			_elm_lang$core$Native_List.fromArray(
				[]),
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = A2(_elm_lang$core$List_ops['::'], hi, list);
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			_elm_lang$core$Native_List.fromArray(
				[]));
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

//import Result //

var _elm_lang$core$Native_Date = function() {

function fromString(str)
{
	var date = new Date(str);
	return isNaN(date.getTime())
		? _elm_lang$core$Result$Err('Unable to parse \'' + str + '\' as a date. Dates must be in the ISO 8601 format.')
		: _elm_lang$core$Result$Ok(date);
}

var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthTable =
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


return {
	fromString: fromString,
	year: function(d) { return d.getFullYear(); },
	month: function(d) { return { ctor: monthTable[d.getMonth()] }; },
	day: function(d) { return d.getDate(); },
	hour: function(d) { return d.getHours(); },
	minute: function(d) { return d.getMinutes(); },
	second: function(d) { return d.getSeconds(); },
	millisecond: function(d) { return d.getMilliseconds(); },
	toTime: function(d) { return d.getTime(); },
	fromTime: function(t) { return new Date(t); },
	dayOfWeek: function(d) { return { ctor: dayTable[d.getDay()] }; }
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		var value = result._0;
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		currentSend(incomingValue);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	_elm_lang$core$Native_List.fromArray(
		[]));
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	_elm_lang$core$Native_List.fromArray(
		[]));
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
var _elm_lang$core$Task$spawnCmd = F2(
	function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(
			A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Platform$sendToApp(router),
				_p1._0));
	});
var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
var _elm_lang$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			_elm_lang$core$Task$onError,
			function (_p2) {
				return _elm_lang$core$Task$fail(
					convert(_p2));
			},
			task);
	});
var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return _elm_lang$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var _elm_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return _elm_lang$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return _elm_lang$core$Task$succeed(
									A3(func, a, b, c));
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map4 = F5(
	function (func, taskA, taskB, taskC, taskD) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return _elm_lang$core$Task$succeed(
											A4(func, a, b, c, d));
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map5 = F6(
	function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return A2(
											_elm_lang$core$Task$andThen,
											function (e) {
												return _elm_lang$core$Task$succeed(
													A5(func, a, b, c, d, e));
											},
											taskE);
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$sequence = function (tasks) {
	var _p3 = tasks;
	if (_p3.ctor === '[]') {
		return _elm_lang$core$Task$succeed(
			_elm_lang$core$Native_List.fromArray(
				[]));
	} else {
		return A3(
			_elm_lang$core$Task$map2,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$List_ops['::'], x, y);
				}),
			_p3._0,
			_elm_lang$core$Task$sequence(_p3._1));
	}
};
var _elm_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			_elm_lang$core$Task$map,
			function (_p4) {
				return {ctor: '_Tuple0'};
			},
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Task$spawnCmd(router),
					commands)));
	});
var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed(
	{ctor: '_Tuple0'});
var _elm_lang$core$Task$onSelfMsg = F3(
	function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	});
var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
var _elm_lang$core$Task$Perform = function (a) {
	return {ctor: 'Perform', _0: a};
};
var _elm_lang$core$Task$perform = F2(
	function (toMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(_elm_lang$core$Task$map, toMessage, task)));
	});
var _elm_lang$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(
					_elm_lang$core$Task$onError,
					function (_p8) {
						return _elm_lang$core$Task$succeed(
							resultToMessage(
								_elm_lang$core$Result$Err(_p8)));
					},
					A2(
						_elm_lang$core$Task$andThen,
						function (_p9) {
							return _elm_lang$core$Task$succeed(
								resultToMessage(
									_elm_lang$core$Result$Ok(_p9)));
						},
						task))));
	});
var _elm_lang$core$Task$cmdMap = F2(
	function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(
			A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Task'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;
	
	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}	
	
	return _elm_lang$core$Native_List.fromArray(is);
}

function toInt(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
		start = 1;
	}
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
	}
	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function toFloat(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
		}
		start = 1;
	}
	var dotCount = 0;
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if ('0' <= c && c <= '9')
		{
			continue;
		}
		if (c === '.')
		{
			dotCount += 1;
			if (dotCount <= 1)
			{
				continue;
			}
		}
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	return _elm_lang$core$Result$Ok(parseFloat(s));
}

function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(_elm_lang$core$List_ops['::'], key, keyList);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2(_elm_lang$core$List_ops['::'], value, valueList);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					_elm_lang$core$List_ops['::'],
					{ctor: '_Tuple2', _0: key, _1: value},
					list);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				_elm_lang$core$Native_List.fromArray(
					[
						'Internal red-black tree invariant violated, expected ',
						msg,
						' and got ',
						_elm_lang$core$Basics$toString(c),
						'/',
						lgot,
						'/',
						rgot,
						'\nPlease report this bug to <https://github.com/elm-lang/core/issues>'
					])));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function() {

var now = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
});

function setInterval_(interval, task)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var id = setInterval(function() {
			_elm_lang$core$Native_Scheduler.rawSpawn(task);
		}, interval);

		return function() { clearInterval(id); };
	});
}

return {
	now: now,
	setInterval_: F2(setInterval_)
};

}();
var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
var _elm_lang$core$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			var spawnRest = function (id) {
				return A3(
					_elm_lang$core$Time$spawnHelp,
					router,
					_p0._1,
					A3(_elm_lang$core$Dict$insert, _p1, id, processes));
			};
			var spawnTimer = _elm_lang$core$Native_Scheduler.spawn(
				A2(
					_elm_lang$core$Time$setInterval,
					_p1,
					A2(_elm_lang$core$Platform$sendToSelf, router, _p1)));
			return A2(_elm_lang$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var _elm_lang$core$Time$addMySub = F2(
	function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				_elm_lang$core$Native_List.fromArray(
					[_p6]),
				state);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				A2(_elm_lang$core$List_ops['::'], _p6, _p4._0),
				state);
		}
	});
var _elm_lang$core$Time$inMilliseconds = function (t) {
	return t;
};
var _elm_lang$core$Time$millisecond = 1;
var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
var _elm_lang$core$Time$inHours = function (t) {
	return t / _elm_lang$core$Time$hour;
};
var _elm_lang$core$Time$inMinutes = function (t) {
	return t / _elm_lang$core$Time$minute;
};
var _elm_lang$core$Time$inSeconds = function (t) {
	return t / _elm_lang$core$Time$second;
};
var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
var _elm_lang$core$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var tellTaggers = function (time) {
				return _elm_lang$core$Task$sequence(
					A2(
						_elm_lang$core$List$map,
						function (tagger) {
							return A2(
								_elm_lang$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						_p7._0));
			};
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p8) {
					return _elm_lang$core$Task$succeed(state);
				},
				A2(_elm_lang$core$Task$andThen, tellTaggers, _elm_lang$core$Time$now));
		}
	});
var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
var _elm_lang$core$Time$State = F2(
	function (a, b) {
		return {taggers: a, processes: b};
	});
var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(
	A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$core$Time$onEffects = F3(
	function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(
			function (_p12, id, _p11) {
				var _p13 = _p11;
				return {
					ctor: '_Tuple3',
					_0: _p13._0,
					_1: _p13._1,
					_2: A2(
						_elm_lang$core$Task$andThen,
						function (_p14) {
							return _p13._2;
						},
						_elm_lang$core$Native_Scheduler.kill(id))
				};
			});
		var bothStep = F4(
			function (interval, taggers, id, _p15) {
				var _p16 = _p15;
				return {
					ctor: '_Tuple3',
					_0: _p16._0,
					_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
					_2: _p16._2
				};
			});
		var leftStep = F3(
			function (interval, taggers, _p17) {
				var _p18 = _p17;
				return {
					ctor: '_Tuple3',
					_0: A2(_elm_lang$core$List_ops['::'], interval, _p18._0),
					_1: _p18._1,
					_2: _p18._2
				};
			});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			_p10.processes,
			{
				ctor: '_Tuple3',
				_0: _elm_lang$core$Native_List.fromArray(
					[]),
				_1: _elm_lang$core$Dict$empty,
				_2: _elm_lang$core$Task$succeed(
					{ctor: '_Tuple0'})
			});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(
			_elm_lang$core$Task$andThen,
			function (newProcesses) {
				return _elm_lang$core$Task$succeed(
					A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
			},
			A2(
				_elm_lang$core$Task$andThen,
				function (_p20) {
					return A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var _elm_lang$core$Time$Every = F2(
	function (a, b) {
		return {ctor: 'Every', _0: a, _1: b};
	});
var _elm_lang$core$Time$every = F2(
	function (interval, tagger) {
		return _elm_lang$core$Time$subscription(
			A2(_elm_lang$core$Time$Every, interval, tagger));
	});
var _elm_lang$core$Time$subMap = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return A2(
			_elm_lang$core$Time$Every,
			_p22._0,
			function (_p23) {
				return f(
					_p22._1(_p23));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Time'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap};

var _elm_lang$core$Date$millisecond = _elm_lang$core$Native_Date.millisecond;
var _elm_lang$core$Date$second = _elm_lang$core$Native_Date.second;
var _elm_lang$core$Date$minute = _elm_lang$core$Native_Date.minute;
var _elm_lang$core$Date$hour = _elm_lang$core$Native_Date.hour;
var _elm_lang$core$Date$dayOfWeek = _elm_lang$core$Native_Date.dayOfWeek;
var _elm_lang$core$Date$day = _elm_lang$core$Native_Date.day;
var _elm_lang$core$Date$month = _elm_lang$core$Native_Date.month;
var _elm_lang$core$Date$year = _elm_lang$core$Native_Date.year;
var _elm_lang$core$Date$fromTime = _elm_lang$core$Native_Date.fromTime;
var _elm_lang$core$Date$toTime = _elm_lang$core$Native_Date.toTime;
var _elm_lang$core$Date$fromString = _elm_lang$core$Native_Date.fromString;
var _elm_lang$core$Date$now = A2(_elm_lang$core$Task$map, _elm_lang$core$Date$fromTime, _elm_lang$core$Time$now);
var _elm_lang$core$Date$Date = {ctor: 'Date'};
var _elm_lang$core$Date$Sun = {ctor: 'Sun'};
var _elm_lang$core$Date$Sat = {ctor: 'Sat'};
var _elm_lang$core$Date$Fri = {ctor: 'Fri'};
var _elm_lang$core$Date$Thu = {ctor: 'Thu'};
var _elm_lang$core$Date$Wed = {ctor: 'Wed'};
var _elm_lang$core$Date$Tue = {ctor: 'Tue'};
var _elm_lang$core$Date$Mon = {ctor: 'Mon'};
var _elm_lang$core$Date$Dec = {ctor: 'Dec'};
var _elm_lang$core$Date$Nov = {ctor: 'Nov'};
var _elm_lang$core$Date$Oct = {ctor: 'Oct'};
var _elm_lang$core$Date$Sep = {ctor: 'Sep'};
var _elm_lang$core$Date$Aug = {ctor: 'Aug'};
var _elm_lang$core$Date$Jul = {ctor: 'Jul'};
var _elm_lang$core$Date$Jun = {ctor: 'Jun'};
var _elm_lang$core$Date$May = {ctor: 'May'};
var _elm_lang$core$Date$Apr = {ctor: 'Apr'};
var _elm_lang$core$Date$Mar = {ctor: 'Mar'};
var _elm_lang$core$Date$Feb = {ctor: 'Feb'};
var _elm_lang$core$Date$Jan = {ctor: 'Jan'};

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
				A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder)
			]));
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function() {

function escape(str)
{
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function caseInsensitive(re)
{
	return new RegExp(re.source, 'gi');
}
function regex(raw)
{
	return new RegExp(raw, 'g');
}

function contains(re, string)
{
	return string.match(re) !== null;
}

function find(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex === re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		out.push({
			match: result[0],
			submatches: _elm_lang$core$Native_List.fromArray(subs),
			index: result.index,
			number: number
		});
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

function replace(n, re, replacer, string)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		return replacer({
			match: match,
			submatches: _elm_lang$core$Native_List.fromArray(submatches),
			index: arguments[i - 1],
			number: count
		});
	}
	return string.replace(re, jsReplacer);
}

function split(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	if (n === Infinity)
	{
		return _elm_lang$core$Native_List.fromArray(str.split(re));
	}
	var string = str;
	var result;
	var out = [];
	var start = re.lastIndex;
	while (n--)
	{
		if (!(result = re.exec(string))) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	return _elm_lang$core$Native_List.fromArray(out);
}

return {
	regex: regex,
	caseInsensitive: caseInsensitive,
	escape: escape,

	contains: F2(contains),
	find: F3(find),
	replace: F4(replace),
	split: F3(split)
};

}();

var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
var _elm_lang$core$Regex$Match = F4(
	function (a, b, c, d) {
		return {match: a, submatches: b, index: c, number: d};
	});
var _elm_lang$core$Regex$Regex = {ctor: 'Regex'};
var _elm_lang$core$Regex$AtMost = function (a) {
	return {ctor: 'AtMost', _0: a};
};
var _elm_lang$core$Regex$All = {ctor: 'All'};

var _elm_lang$http$Native_Http = function() {


// ENCODING AND DECODING

function encodeUri(string)
{
	return encodeURIComponent(string);
}

function decodeUri(string)
{
	try
	{
		return _elm_lang$core$Maybe$Just(decodeURIComponent(string));
	}
	catch(e)
	{
		return _elm_lang$core$Maybe$Nothing;
	}
}


// SEND REQUEST

function toTask(request, maybeProgress)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NetworkError' }));
		});
		xhr.addEventListener('timeout', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Timeout' }));
		});
		xhr.addEventListener('load', function() {
			callback(handleResponse(xhr, request.expect.responseToResult));
		});

		try
		{
			xhr.open(request.method, request.url, true);
		}
		catch (e)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'BadUrl', _0: request.url }));
		}

		configureRequest(xhr, request);
		send(xhr, request.body);

		return function() { xhr.abort(); };
	});
}

function configureProgress(xhr, maybeProgress)
{
	if (maybeProgress.ctor === 'Nothing')
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_elm_lang$core$Native_Scheduler.rawSpawn(maybeProgress._0({
			bytes: event.loaded,
			bytesExpected: event.total
		}));
	});
}

function configureRequest(xhr, request)
{
	function setHeader(pair)
	{
		xhr.setRequestHeader(pair._0, pair._1);
	}

	A2(_elm_lang$core$List$map, setHeader, request.headers);
	xhr.responseType = request.expect.responseType;
  xhr.timeout = request.timeout._0;
	xhr.withCredentials = request.withCredentials;
}

function send(xhr, body)
{
	switch (body.ctor)
	{
		case 'EmptyBody':
			xhr.send();
			return;

		case 'StringBody':
			xhr.setRequestHeader('Content-Type', body._0);
			xhr.send(body._1);
			return;

		case 'FormDataBody':
			xhr.send(body._0);
			return;
	}
}


// RESPONSES

function handleResponse(xhr, responseToResult)
{
	var response = toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadStatus',
			_0: response
		});
	}

	var result = responseToResult(response);

	if (result.ctor === 'Ok')
	{
		return _elm_lang$core$Native_Scheduler.succeed(result._0);
	}
	else
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadPayload',
			_0: result._0,
			_1: response
		});
	}
}

function toResponse(xhr)
{
	return {
		status: { code: xhr.status, message: xhr.statusText },
		headers: parseHeaders(xhr.getAllResponseHeaders()),
		url: xhr.responseURL,
		body: xhr.response
	};
}

function parseHeaders(rawHeaders)
{
	var headers = _elm_lang$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(_elm_lang$core$Dict$update, key, function(oldValue) {
				if (oldValue.ctor === 'Just')
				{
					return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
				}
				return _elm_lang$core$Maybe$Just(value);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function expectStringResponse(responseToResult)
{
	return {
		responseType: 'text',
		responseToResult: responseToResult
	};
}

function mapExpect(func, expect)
{
	return {
		responseType: expect.responseType,
		responseToResult: function(response) {
			var convertedResponse = expect.responseToResult(response);
			return A2(_elm_lang$core$Result$map, func, convertedResponse);
		}
	};
}


// BODY

function multipart(parts)
{
	var formData = new FormData();

	while (parts.ctor !== '[]')
	{
		var part = parts._0;
		formData.append(part._0, part._1);
		parts = parts._1;
	}

	return { ctor: 'FormDataBody', _0: formData };
}

return {
	toTask: F2(toTask),
	expectStringResponse: expectStringResponse,
	mapExpect: F2(mapExpect),
	multipart: multipart,
	encodeUri: encodeUri,
	decodeUri: decodeUri
};

}();

var _elm_lang$http$Http_Internal$map = F2(
	function (func, request) {
		return _elm_lang$core$Native_Utils.update(
			request,
			{
				expect: A2(_elm_lang$http$Native_Http.mapExpect, func, request.expect)
			});
	});
var _elm_lang$http$Http_Internal$RawRequest = F7(
	function (a, b, c, d, e, f, g) {
		return {method: a, headers: b, url: c, body: d, expect: e, timeout: f, withCredentials: g};
	});
var _elm_lang$http$Http_Internal$Request = function (a) {
	return {ctor: 'Request', _0: a};
};
var _elm_lang$http$Http_Internal$Expect = {ctor: 'Expect'};
var _elm_lang$http$Http_Internal$FormDataBody = {ctor: 'FormDataBody'};
var _elm_lang$http$Http_Internal$StringBody = F2(
	function (a, b) {
		return {ctor: 'StringBody', _0: a, _1: b};
	});
var _elm_lang$http$Http_Internal$EmptyBody = {ctor: 'EmptyBody'};
var _elm_lang$http$Http_Internal$Header = F2(
	function (a, b) {
		return {ctor: 'Header', _0: a, _1: b};
	});

var _elm_lang$http$Http$decodeUri = _elm_lang$http$Native_Http.decodeUri;
var _elm_lang$http$Http$encodeUri = _elm_lang$http$Native_Http.encodeUri;
var _elm_lang$http$Http$expectStringResponse = _elm_lang$http$Native_Http.expectStringResponse;
var _elm_lang$http$Http$expectJson = function (decoder) {
	return _elm_lang$http$Http$expectStringResponse(
		function (response) {
			return A2(_elm_lang$core$Json_Decode$decodeString, decoder, response.body);
		});
};
var _elm_lang$http$Http$expectString = _elm_lang$http$Http$expectStringResponse(
	function (response) {
		return _elm_lang$core$Result$Ok(response.body);
	});
var _elm_lang$http$Http$multipartBody = _elm_lang$http$Native_Http.multipart;
var _elm_lang$http$Http$stringBody = _elm_lang$http$Http_Internal$StringBody;
var _elm_lang$http$Http$jsonBody = function (value) {
	return A2(
		_elm_lang$http$Http_Internal$StringBody,
		'application/json',
		A2(_elm_lang$core$Json_Encode$encode, 0, value));
};
var _elm_lang$http$Http$emptyBody = _elm_lang$http$Http_Internal$EmptyBody;
var _elm_lang$http$Http$header = _elm_lang$http$Http_Internal$Header;
var _elm_lang$http$Http$request = _elm_lang$http$Http_Internal$Request;
var _elm_lang$http$Http$post = F3(
	function (url, body, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'POST',
				headers: _elm_lang$core$Native_List.fromArray(
					[]),
				url: url,
				body: body,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$get = F2(
	function (url, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'GET',
				headers: _elm_lang$core$Native_List.fromArray(
					[]),
				url: url,
				body: _elm_lang$http$Http$emptyBody,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$getString = function (url) {
	return _elm_lang$http$Http$request(
		{
			method: 'GET',
			headers: _elm_lang$core$Native_List.fromArray(
				[]),
			url: url,
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectString,
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
};
var _elm_lang$http$Http$toTask = function (_p0) {
	var _p1 = _p0;
	return A2(_elm_lang$http$Native_Http.toTask, _p1._0, _elm_lang$core$Maybe$Nothing);
};
var _elm_lang$http$Http$send = F2(
	function (resultToMessage, request) {
		return A2(
			_elm_lang$core$Task$attempt,
			resultToMessage,
			_elm_lang$http$Http$toTask(request));
	});
var _elm_lang$http$Http$Response = F4(
	function (a, b, c, d) {
		return {url: a, status: b, headers: c, body: d};
	});
var _elm_lang$http$Http$BadPayload = F2(
	function (a, b) {
		return {ctor: 'BadPayload', _0: a, _1: b};
	});
var _elm_lang$http$Http$BadStatus = function (a) {
	return {ctor: 'BadStatus', _0: a};
};
var _elm_lang$http$Http$NetworkError = {ctor: 'NetworkError'};
var _elm_lang$http$Http$Timeout = {ctor: 'Timeout'};
var _elm_lang$http$Http$BadUrl = function (a) {
	return {ctor: 'BadUrl', _0: a};
};
var _elm_lang$http$Http$StringPart = F2(
	function (a, b) {
		return {ctor: 'StringPart', _0: a, _1: b};
	});
var _elm_lang$http$Http$stringPart = _elm_lang$http$Http$StringPart;

var _elm_native_ui$elm_native_ui$Native_NativeUi = (function () {

  var ReactNative = require('react-native');
  var React = require('react');
  var toArray = _elm_lang$core$Native_List.toArray;

  // PROPS

  /**
   * Declares a message decoder to be run on an event for a particular node
   */
  function on(eventName, decoder) {
    return {
      type: 'event',
      eventName: eventName,
      decoder: decoder
    };
  }

  /**
   * Declares a style attribute for a node, expressed as an inline styles for
   * the moment.
   */
  function style(attrs) {
    return {
      type: 'style',
      sheet: attrs
    };
  }

  /**
   * Declares any other kind of property for a node.
   */
  function property(propName, value) {
    return {
      type: 'prop',
      propName: propName,
      value: value
    };
  }


  // ELEMENTS

  /**
   * A plain string node
   */
  function string(text) {
    return {
      type: 'string',
      string: text
    };
  }

  /**
   * A node that renders a React Native component with props and children
   */
  function node(tagName) {
    return F2(function(factList, childList) {
      return {
        type: 'component',
        tagName: tagName,
        facts: toArray(factList),
        children: toArray(childList)
      };
    });
  }

  /**
   * A node that renders a React Native component with props, but no children.
   * This can improve performance by reducing function calls during
   * tree-building and can allow for optimizations later on as well.
   */
  function voidNode(tagName) {
    return function (factList) {
      return {
        type: 'component',
        tagName: tagName,
        facts: toArray(factList),
        children: []
      };
    };
  }

  /**
   * Maps another node onto a different message type
   */
  function map(tagger, node) {
    return {
      type: 'tagger',
      tagger: tagger,
      node: node
    };
  }

  // RENDER

  /**
   * Converts a stack of `on` handlers and `map` nodes into a final function
   * that can be passed into a React Native component's `onSomeEvent` props
   */
  function makeEventHandler(eventNode, decoder) {
    function eventHandler(event) {
      var decoder = eventHandler.decoder;
      var value = A2(_elm_lang$core$Native_Json.run, decoder, event);

      if (value.ctor !== 'Ok') {
        return;
      }

      var message = value._0;
      var currentEventNode = eventNode;
      while (currentEventNode) {
        var tagger = currentEventNode.tagger;

        if (typeof tagger === 'function') {
          message = tagger(message);
        } else {
          for (var i = tagger.length; i--; ) {
            message = tagger[i](message);
          }
        }

        currentEventNode = currentEventNode.parent;
      }
    }

    eventHandler.decoder = decoder;

    return eventHandler;
  }

  /**
   * Converts a string node back to a plain string for React Native to render
   */
  function renderString(node) {
    return node.string;
  }

  /**
   * Composes taggers created by `map`
   */
  function renderTagger(node, eventNode) {
    var subNode = node.node;
    var tagger = node.tagger;

    while (subNode.type === 'tagger') {
      typeof tagger !== 'object' ?
        tagger = [tagger, subNode.tagger] :
        tagger.push(subNode.tagger);

      subNode = subNode.node;
    }

    var subEventRoot = { tagger: tagger, parent: eventNode };
    return renderTree(subNode, subEventRoot);
  }

  /**
   * Converts a component node into an actual React Native node. Builds the
   * children array and props object, looks up the component by name on the
   * React Native module and calls into React.createElement.
   */
  function renderComponent(node, eventNode) {
    var children = [];
    for (var i = 0; i < node.children.length; i++) {
      children.push(renderTree(node.children[i], eventNode));
    }

    var finalProps = {};

    for (var i = 0; i < node.facts.length; i++) {
      var fact = node.facts[i];
      switch (fact.type) {
        case 'prop':
          finalProps[fact.propName] = fact.value;
          break;

        case 'event':
          finalProps[fact.eventName] = makeEventHandler(eventNode, fact.decoder);
          break;

        case 'style':
          finalProps.style = fact.sheet;
          break;
      }
    }

    if (children.length === 1) {
      finalProps.children = children[0];
    } else if (children.length) {
      finalProps.children = children;
    }

    return React.createElement(ReactNative[node.tagName], finalProps);
  }

  /**
   * Renders the whole tree!
   */
  function renderTree(node, eventNode) {
    switch (node.type) {
      case 'string':
        return renderString(node);

      case 'tagger':
        return renderTagger(node, eventNode);

      case 'component':
        return renderComponent(node, eventNode);
    }
  }

  // PROGRAM

  /**
   * Takes am Elm Native UI program implementation and turns into a React
   * component that will begin rendering the virtual tree as soon as the Elm
   * program starts running
   */
  function makeComponent(impl) {
    return React.createClass({
      getInitialState: function getInitialState() {
        return {};
      },

      componentDidMount: function componentDidMount() {
        this.eventNode = { tagger: function() {}, parent: undefined };

        this._app = _elm_lang$core$Native_Platform.initialize(
          impl.init,
          impl.update,
          impl.subscriptions,
          this.renderer
        );
      },

      renderer: function renderer(onMessage, initialModel) {
        this.eventNode.tagger = onMessage;
        this.updateModel(initialModel);
        return this.updateModel;
      },

      updateModel: function updateModel(model) {
        this.setState({ model: model });
      },

      render: function render() {
        // There won't be a model to render right away so we'll check that it
        // exists before trying to call the view function
        return typeof this.state.model !== 'undefined' ?
          renderTree(impl.view(this.state.model), this.eventNode) :
          null;
      }
    });
  }

  /**
   * Makes an Elm program from the standard init, model, update, view
   * specification and adds a function to your module called `start` that,
   * when called in JavaScript-land, will return a React component that you can
   * render or register with the AppRegistry. In the future this function will
   * also deal with decoding flags from JavaScript and setting up debugging
   * facilities. But for now it just returns a `Program Never model msg` that
   * you can pass to `main`.
   */
  function program(impl) {
    return function(flagDecoder) {
      return function(object, moduleName, debugMetadata) {
        object.start = function start() {
          return makeComponent(impl);
        };
      };
    };
  }

  // UTILS

  /**
   * Useful for encoding a Date.Date as a Json.Encode.Value since Date.Date is
   * just a plain JavaScript Date. This can be used for props on things like
   * DatePickerIOS that expect date values.
   */
  function identity(value) {
    return value;
  }

  /**
   * When combined with `Decode.andThen`, creates a decoder for a Date.Date from
   * a plain JavaScript Date. This can be used for event handlers that pass a
   * Date.
   */
  function parseDate(value) {
    if (value instanceof Date) {
      return _elm_lang$core$Native_Json.succeed(value);
    } else {
      return _elm_lang$core$Native_Json.fail('Expected a Date, but did not find one');
    }
  }

  return {
    program: program,
    node: node,
    voidNode: voidNode,
    string: string,
    map: F2(map),
    on: F2(on),
    style: style,
    property: F2(property),
    encodeDate: identity,
    parseDate: parseDate
  };
}());

var _elm_native_ui$elm_native_ui$NativeUi_Style$defaultTransform = {perspective: _elm_lang$core$Maybe$Nothing, rotate: _elm_lang$core$Maybe$Nothing, rotateX: _elm_lang$core$Maybe$Nothing, rotateY: _elm_lang$core$Maybe$Nothing, rotateZ: _elm_lang$core$Maybe$Nothing, scale: _elm_lang$core$Maybe$Nothing, scaleX: _elm_lang$core$Maybe$Nothing, scaleY: _elm_lang$core$Maybe$Nothing, translateX: _elm_lang$core$Maybe$Nothing, translateY: _elm_lang$core$Maybe$Nothing, skewX: _elm_lang$core$Maybe$Nothing, skewY: _elm_lang$core$Maybe$Nothing};
var _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue = function (value) {
	var _p0 = value;
	switch (_p0.ctor) {
		case 'NumberValue':
			return _elm_lang$core$Json_Encode$float(_p0._0);
		case 'StringValue':
			return _elm_lang$core$Json_Encode$string(_p0._0);
		case 'ObjectValue':
			return _elm_lang$core$Json_Encode$object(
				A2(_elm_lang$core$List$map, _elm_native_ui$elm_native_ui$NativeUi_Style$encodeDeclaration, _p0._0));
		default:
			return _elm_lang$core$Json_Encode$list(
				A2(
					_elm_lang$core$List$map,
					_elm_native_ui$elm_native_ui$NativeUi_Style$encodeObject,
					A2(_elm_lang$core$List$filterMap, _elm_lang$core$Basics$identity, _p0._0)));
	}
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$encodeDeclaration = function (_p1) {
	var _p2 = _p1;
	return {
		ctor: '_Tuple2',
		_0: _p2._0,
		_1: _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue(_p2._1)
	};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$encodeObject = function (_p3) {
	var _p4 = _p3;
	return _elm_lang$core$Json_Encode$object(
		_elm_lang$core$Native_List.fromArray(
			[
				{
				ctor: '_Tuple2',
				_0: _p4._0,
				_1: _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue(_p4._1)
			}
			]));
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$toJsonProperty = function (style) {
	var _p5 = style;
	switch (_p5.ctor) {
		case 'StringStyle':
			return {
				ctor: '_Tuple2',
				_0: _p5._0._0,
				_1: _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue(_p5._0._1)
			};
		case 'NumberStyle':
			return {
				ctor: '_Tuple2',
				_0: _p5._0._0,
				_1: _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue(_p5._0._1)
			};
		case 'ObjectStyle':
			return {
				ctor: '_Tuple2',
				_0: _p5._0._0,
				_1: _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue(_p5._0._1)
			};
		default:
			return {
				ctor: '_Tuple2',
				_0: _p5._0._0,
				_1: _elm_native_ui$elm_native_ui$NativeUi_Style$encodeValue(_p5._0._1)
			};
	}
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$encode = function (styles) {
	return _elm_lang$core$Json_Encode$object(
		A2(_elm_lang$core$List$map, _elm_native_ui$elm_native_ui$NativeUi_Style$toJsonProperty, styles));
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$Transform = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return {perspective: a, rotate: b, rotateX: c, rotateY: d, rotateZ: e, scale: f, scaleX: g, scaleY: h, translateX: i, translateY: j, skewX: k, skewY: l};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$ListValue = function (a) {
	return {ctor: 'ListValue', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$listDeclaration = F2(
	function (name, value) {
		return {
			ctor: '_Tuple2',
			_0: name,
			_1: _elm_native_ui$elm_native_ui$NativeUi_Style$ListValue(value)
		};
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$ObjectValue = function (a) {
	return {ctor: 'ObjectValue', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$objectDeclaration = F2(
	function (name, value) {
		return {
			ctor: '_Tuple2',
			_0: name,
			_1: _elm_native_ui$elm_native_ui$NativeUi_Style$ObjectValue(value)
		};
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$NumberValue = function (a) {
	return {ctor: 'NumberValue', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration = F2(
	function (name, value) {
		return {
			ctor: '_Tuple2',
			_0: name,
			_1: _elm_native_ui$elm_native_ui$NativeUi_Style$NumberValue(value)
		};
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$StringValue = function (a) {
	return {ctor: 'StringValue', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration = F2(
	function (name, value) {
		return {
			ctor: '_Tuple2',
			_0: name,
			_1: _elm_native_ui$elm_native_ui$NativeUi_Style$StringValue(value)
		};
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$ListStyle = function (a) {
	return {ctor: 'ListStyle', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$listStyle = F2(
	function (name, list) {
		return _elm_native_ui$elm_native_ui$NativeUi_Style$ListStyle(
			A2(_elm_native_ui$elm_native_ui$NativeUi_Style$listDeclaration, name, list));
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$transform = function (options) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Style$listStyle,
		'transform',
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration('perspective'),
				options.perspective),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration('rotate'),
				options.rotate),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration('rotateX'),
				options.rotateX),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration('rotateY'),
				options.rotateY),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration('rotateZ'),
				options.rotateZ),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration('scale'),
				options.scale),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration('scaleX'),
				options.scaleX),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration('scaleY'),
				options.scaleY),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration('translateX'),
				options.translateX),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration('translateY'),
				options.translateY),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration('skewX'),
				options.skewX),
				A2(
				_elm_lang$core$Maybe$map,
				_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration('skewY'),
				options.skewY)
			]));
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$ObjectStyle = function (a) {
	return {ctor: 'ObjectStyle', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$objectStyle = F2(
	function (name, list) {
		return _elm_native_ui$elm_native_ui$NativeUi_Style$ObjectStyle(
			A2(_elm_native_ui$elm_native_ui$NativeUi_Style$objectDeclaration, name, list));
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$shadowOffset = F2(
	function (width, height) {
		return A2(
			_elm_native_ui$elm_native_ui$NativeUi_Style$objectStyle,
			'shadowOffset',
			_elm_lang$core$Native_List.fromArray(
				[
					A2(_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration, 'width', width),
					A2(_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration, 'height', height)
				]));
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$NumberStyle = function (a) {
	return {ctor: 'NumberStyle', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle = F2(
	function (name, value) {
		return _elm_native_ui$elm_native_ui$NativeUi_Style$NumberStyle(
			A2(_elm_native_ui$elm_native_ui$NativeUi_Style$numberDeclaration, name, value));
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$fontSize = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('fontSize');
var _elm_native_ui$elm_native_ui$NativeUi_Style$letterSpacing = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('letterSpacing');
var _elm_native_ui$elm_native_ui$NativeUi_Style$lineHeight = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('lineHeight');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderRadius = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderRadius');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderTopLeftRadius = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderTopLeftRadius');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderTopRightRadius = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderTopRightRadius');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomLeftRadius = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderBottomLeftRadius');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomRightRadius = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderBottomRightRadius');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderWidth = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderWidth');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderTopWidth = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderTopWidth');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderRightWidth = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderRightWidth');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomWidth = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderBottomWidth');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderLeftWidth = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('borderLeftWidth');
var _elm_native_ui$elm_native_ui$NativeUi_Style$opacity = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('opacity');
var _elm_native_ui$elm_native_ui$NativeUi_Style$shadowOpacity = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('shadowOpacity');
var _elm_native_ui$elm_native_ui$NativeUi_Style$shadowRadius = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('shadowRadius');
var _elm_native_ui$elm_native_ui$NativeUi_Style$bottom = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('bottom');
var _elm_native_ui$elm_native_ui$NativeUi_Style$flex = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('flex');
var _elm_native_ui$elm_native_ui$NativeUi_Style$height = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('height');
var _elm_native_ui$elm_native_ui$NativeUi_Style$left = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('left');
var _elm_native_ui$elm_native_ui$NativeUi_Style$margin = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('margin');
var _elm_native_ui$elm_native_ui$NativeUi_Style$marginBottom = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('marginBottom');
var _elm_native_ui$elm_native_ui$NativeUi_Style$marginHorizontal = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('marginHorizontal');
var _elm_native_ui$elm_native_ui$NativeUi_Style$marginLeft = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('marginLeft');
var _elm_native_ui$elm_native_ui$NativeUi_Style$marginRight = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('marginRight');
var _elm_native_ui$elm_native_ui$NativeUi_Style$marginTop = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('marginTop');
var _elm_native_ui$elm_native_ui$NativeUi_Style$marginVertical = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('marginVertical');
var _elm_native_ui$elm_native_ui$NativeUi_Style$padding = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('padding');
var _elm_native_ui$elm_native_ui$NativeUi_Style$paddingBottom = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('paddingBottom');
var _elm_native_ui$elm_native_ui$NativeUi_Style$paddingHorizontal = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('paddingHorizontal');
var _elm_native_ui$elm_native_ui$NativeUi_Style$paddingLeft = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('paddingLeft');
var _elm_native_ui$elm_native_ui$NativeUi_Style$paddingRight = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('paddingRight');
var _elm_native_ui$elm_native_ui$NativeUi_Style$paddingTop = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('paddingTop');
var _elm_native_ui$elm_native_ui$NativeUi_Style$paddingVertical = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('paddingVertical');
var _elm_native_ui$elm_native_ui$NativeUi_Style$right = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('right');
var _elm_native_ui$elm_native_ui$NativeUi_Style$top = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('top');
var _elm_native_ui$elm_native_ui$NativeUi_Style$width = _elm_native_ui$elm_native_ui$NativeUi_Style$numberStyle('width');
var _elm_native_ui$elm_native_ui$NativeUi_Style$StringStyle = function (a) {
	return {ctor: 'StringStyle', _0: a};
};
var _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle = F2(
	function (name, value) {
		return _elm_native_ui$elm_native_ui$NativeUi_Style$StringStyle(
			A2(_elm_native_ui$elm_native_ui$NativeUi_Style$stringDeclaration, name, value));
	});
var _elm_native_ui$elm_native_ui$NativeUi_Style$color = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('color');
var _elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('fontFamily');
var _elm_native_ui$elm_native_ui$NativeUi_Style$fontStyle = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('fontStyle');
var _elm_native_ui$elm_native_ui$NativeUi_Style$fontWeight = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('fontWeight');
var _elm_native_ui$elm_native_ui$NativeUi_Style$textAlign = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('textAlign');
var _elm_native_ui$elm_native_ui$NativeUi_Style$textDecorationLine = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('textDecorationLine');
var _elm_native_ui$elm_native_ui$NativeUi_Style$textDecorationStyle = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('textDecorationStyle');
var _elm_native_ui$elm_native_ui$NativeUi_Style$textDecorationColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('textDecorationColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$writingDirection = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('writingDirection');
var _elm_native_ui$elm_native_ui$NativeUi_Style$backfaceVisibility = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('backfaceVisibility');
var _elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('backgroundColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('borderColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderTopColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('borderTopColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderRightColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('borderRightColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('borderBottomColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderLeftColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('borderLeftColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$borderStyle = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('borderStyle');
var _elm_native_ui$elm_native_ui$NativeUi_Style$overflow = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('overflow');
var _elm_native_ui$elm_native_ui$NativeUi_Style$shadowColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('shadowColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$resizeMode = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('resizeMode');
var _elm_native_ui$elm_native_ui$NativeUi_Style$tintColor = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('tintColor');
var _elm_native_ui$elm_native_ui$NativeUi_Style$alignItems = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('alignItems');
var _elm_native_ui$elm_native_ui$NativeUi_Style$alignSelf = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('alignSelf');
var _elm_native_ui$elm_native_ui$NativeUi_Style$flexDirection = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('flexDirection');
var _elm_native_ui$elm_native_ui$NativeUi_Style$flexWrap = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('flexWrap');
var _elm_native_ui$elm_native_ui$NativeUi_Style$justifyContent = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('justifyContent');
var _elm_native_ui$elm_native_ui$NativeUi_Style$position = _elm_native_ui$elm_native_ui$NativeUi_Style$stringStyle('position');

var _elm_native_ui$elm_native_ui$NativeUi$program = function (stuff) {
	return _elm_native_ui$elm_native_ui$Native_NativeUi.program(stuff);
};
var _elm_native_ui$elm_native_ui$NativeUi$map = F2(
	function (tagger, element) {
		return A2(_elm_native_ui$elm_native_ui$Native_NativeUi.map, tagger, element);
	});
var _elm_native_ui$elm_native_ui$NativeUi$on = function (eventName) {
	var realEventName = A2(_elm_lang$core$Basics_ops['++'], 'on', eventName);
	return _elm_native_ui$elm_native_ui$Native_NativeUi.on(realEventName);
};
var _elm_native_ui$elm_native_ui$NativeUi$style = function (styles) {
	return _elm_native_ui$elm_native_ui$Native_NativeUi.style(
		_elm_native_ui$elm_native_ui$NativeUi_Style$encode(styles));
};
var _elm_native_ui$elm_native_ui$NativeUi$property = F2(
	function (name, value) {
		return _elm_native_ui$elm_native_ui$Native_NativeUi.property;
	});
var _elm_native_ui$elm_native_ui$NativeUi$string = _elm_native_ui$elm_native_ui$Native_NativeUi.string;
var _elm_native_ui$elm_native_ui$NativeUi$node = _elm_native_ui$elm_native_ui$Native_NativeUi.node;
var _elm_native_ui$elm_native_ui$NativeUi$Node = {ctor: 'Node'};
var _elm_native_ui$elm_native_ui$NativeUi$Property = {ctor: 'Property'};

var _elm_native_ui$elm_native_ui$NativeUi_Elements$view = _elm_native_ui$elm_native_ui$NativeUi$node('View');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$toolbar = _elm_native_ui$elm_native_ui$NativeUi$node('Toolbar');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$textInput = _elm_native_ui$elm_native_ui$NativeUi$node('TextInput');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$tabBar = _elm_native_ui$elm_native_ui$NativeUi$node('TabBar');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$switch = _elm_native_ui$elm_native_ui$NativeUi$node('Switch');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$statusBar = _elm_native_ui$elm_native_ui$NativeUi$node('StatusBar');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$slider = _elm_native_ui$elm_native_ui$NativeUi$node('Slider');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$segmentedControl = _elm_native_ui$elm_native_ui$NativeUi$node('SegmentedControl');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$scrollView = _elm_native_ui$elm_native_ui$NativeUi$node('ScrollView');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$refreshControl = _elm_native_ui$elm_native_ui$NativeUi$node('RefreshControl');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$progressView = _elm_native_ui$elm_native_ui$NativeUi$node('ProgressView');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$progressBar = _elm_native_ui$elm_native_ui$NativeUi$node('ProgressBar');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$picker = _elm_native_ui$elm_native_ui$NativeUi$node('Picker');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$mapView = _elm_native_ui$elm_native_ui$NativeUi$node('MapView');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$activityIndicator = _elm_native_ui$elm_native_ui$NativeUi$node('ActivityIndicator');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$image = _elm_native_ui$elm_native_ui$NativeUi$node('Image');
var _elm_native_ui$elm_native_ui$NativeUi_Elements$text = _elm_native_ui$elm_native_ui$NativeUi$node('Text');

var _elm_native_ui$elm_native_ui$NativeUi_Events$onChangeText = function (tagger) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$on,
		'ChangeText',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$core$Json_Decode$string));
};
var _elm_native_ui$elm_native_ui$NativeUi_Events$onSwitchValueChange = function (tagger) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$on,
		'SwitchValueChange',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$core$Json_Decode$int));
};
var _elm_native_ui$elm_native_ui$NativeUi_Events$onSliderValueChange = function (tagger) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$on,
		'SliderValueChange',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$core$Json_Decode$float));
};
var _elm_native_ui$elm_native_ui$NativeUi_Events$onSegmentedControlValueChange = function (tagger) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$on,
		'SegmentedControlValueChange',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$core$Json_Decode$int));
};
var _elm_native_ui$elm_native_ui$NativeUi_Events$onPickerValueChange = function (tagger) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$on,
		'PickerValueChange',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$core$Json_Decode$string));
};
var _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent = F2(
	function (name, msg) {
		return A2(
			_elm_native_ui$elm_native_ui$NativeUi$on,
			name,
			_elm_lang$core$Json_Decode$succeed(msg));
	});
var _elm_native_ui$elm_native_ui$NativeUi_Events$onLayout = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Layout');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onPress = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Press');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onLoadStart = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('LoadStart');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onProgress = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Progress');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onError = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Error');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onLoad = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Load');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onLoadEnd = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('LoadEnd');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onRegionChange = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('RegionChange');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onRegionChangeComplete = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('RegionChangeComplete');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onAnnotationPress = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('AnnotationPress');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onRefresh = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Refresh');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onScroll = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Scroll');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onScrollAnimationEnd = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ScrollAnimationEnd');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onContentSizeChange = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ContentSizeChange');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onChange = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Change');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onSlidingComplete = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('SlidingComplete');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onBlur = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Blur');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onFocus = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('Focus');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onEndEditing = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('EndEditing');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onSelectionChange = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('SelectionChange');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onSubmitEditing = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('SubmitEditing');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onKeyPress = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('KeyPress');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onActionSelected = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ActionSelected');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onIconClicked = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('IconClicked');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onAccessibilityTap = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('AccessibilityTap');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onMagicTap = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('MagicTap');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onResponderGrant = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ResponderGrant');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onResponderMove = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ResponderMove');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onResponderReject = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ResponderReject');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onResponderRelease = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ResponderRelease');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onResponderTerminate = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ResponderTerminate');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onResponderTerminationRequest = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('ResponderTerminationRequest');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onStartShouldSetResponder = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('StartShouldSetResponder');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onStartShouldSetResponderCapture = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('StartShouldSetResponderCapture');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onMoveShouldSetResponder = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('MoveShouldSetResponder');
var _elm_native_ui$elm_native_ui$NativeUi_Events$onMoveShouldSetResponderCapture = _elm_native_ui$elm_native_ui$NativeUi_Events$constantMsgEvent('MoveShouldSetResponderCapture');

var _elm_native_ui$elm_native_ui$NativeUi_Properties$needsOffscreenAlphaCompositing = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'needsOffscreenAlphaCompositing',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$collapsable = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'collapsable',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$shouldRasterizeIOS = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'shouldRasterizeIOS',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$renderToHardwareTextureAndroid = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'renderToHardwareTextureAndroid',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$pointerEvents = function (val) {
	var stringValue = function () {
		var _p0 = val;
		switch (_p0.ctor) {
			case 'ViewPointerEventsBoxNone':
				return 'box-none';
			case 'ViewPointerEventsNone':
				return 'none';
			case 'ViewPointerEventsBoxOnly':
				return 'box-only';
			default:
				return 'auto';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'pointerEvents', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$importantForAccessibility = function (val) {
	var stringValue = function () {
		var _p1 = val;
		switch (_p1.ctor) {
			case 'ViewImportantForAccessibilityAuto':
				return 'auto';
			case 'ViewImportantForAccessibilityYes':
				return 'yes';
			case 'ViewImportantForAccessibilityNo':
				return 'no';
			default:
				return 'no-hide-descendants';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'importantForAccessibility', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$accessibilityLiveRegion = function (val) {
	var stringValue = function () {
		var _p2 = val;
		switch (_p2.ctor) {
			case 'ViewAccessibilityLiveRegionNone':
				return 'none';
			case 'ViewAccessibilityLiveRegionPolite':
				return 'polite';
			default:
				return 'assertive';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'accessibilityLiveRegion', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$rtl = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'rtl',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$contentInsetEnd = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'contentInsetEnd',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$contentInsetStart = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'contentInsetStart',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$subtitle = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'subtitle',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$underlineColorAndroid = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'underlineColorAndroid',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$blurOnSubmit = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'blurOnSubmit',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$selectTextOnFocus = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'selectTextOnFocus',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$clearTextOnFocus = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'clearTextOnFocus',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$clearButtonMode = function (val) {
	var stringValue = function () {
		var _p3 = val;
		switch (_p3.ctor) {
			case 'TextInputClearButtonModeNever':
				return 'never';
			case 'TextInputClearButtonModeWhileEditing':
				return 'while-editing';
			case 'TextInputClearButtonModeUnlessEditing':
				return 'unless-editing';
			default:
				return 'always';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'clearButtonMode', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$defaultValue = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'defaultValue',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$value = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'value',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$selectionColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'selectionColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$secureTextEntry = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'secureTextEntry',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$placeholderTextColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'placeholderTextColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$placeholder = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'placeholder',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$multiline = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'multiline',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$enablesReturnKeyAutomatically = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'enablesReturnKeyAutomatically',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$maxLength = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'maxLength',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$returnKeyType = function (val) {
	var stringValue = function () {
		var _p4 = val;
		switch (_p4.ctor) {
			case 'TextInputReturnKeyTypeDefault':
				return 'default';
			case 'TextInputReturnKeyTypeGo':
				return 'go';
			case 'TextInputReturnKeyTypeGoogle':
				return 'google';
			case 'TextInputReturnKeyTypeJoin':
				return 'join';
			case 'TextInputReturnKeyTypeNext':
				return 'next';
			case 'TextInputReturnKeyTypeRoute':
				return 'route';
			case 'TextInputReturnKeyTypeSearch':
				return 'search';
			case 'TextInputReturnKeyTypeSend':
				return 'send';
			case 'TextInputReturnKeyTypeYahoo':
				return 'yahoo';
			case 'TextInputReturnKeyTypeDone':
				return 'done';
			default:
				return 'emergency-call';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'returnKeyType', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$keyboardAppearance = function (val) {
	var stringValue = function () {
		var _p5 = val;
		switch (_p5.ctor) {
			case 'TextInputKeyboardAppearanceDefault':
				return 'default';
			case 'TextInputKeyboardAppearanceLight':
				return 'light';
			default:
				return 'dark';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'keyboardAppearance', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$keyboardType = function (val) {
	var stringValue = function () {
		var _p6 = val;
		switch (_p6.ctor) {
			case 'TextInputKeyboardTypeDefault':
				return 'default';
			case 'TextInputKeyboardTypeEmailAddress':
				return 'email-address';
			case 'TextInputKeyboardTypeNumeric':
				return 'numeric';
			case 'TextInputKeyboardTypePhonePad':
				return 'phone-pad';
			case 'TextInputKeyboardTypeAsciiCapable':
				return 'ascii-capable';
			case 'TextInputKeyboardTypeNumbersAndPunctuation':
				return 'numbers-and-punctuation';
			case 'TextInputKeyboardTypeUrl':
				return 'url';
			case 'TextInputKeyboardTypeNumberPad':
				return 'number-pad';
			case 'TextInputKeyboardTypeNamePhonePad':
				return 'name-phone-pad';
			case 'TextInputKeyboardTypeDecimalPad':
				return 'decimal-pad';
			case 'TextInputKeyboardTypeTwitter':
				return 'twitter';
			default:
				return 'web-search';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'keyboardType', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$editable = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'editable',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$autoFocus = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'autoFocus',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$autoCorrect = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'autoCorrect',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$autoCapitalize = function (val) {
	var stringValue = function () {
		var _p7 = val;
		switch (_p7.ctor) {
			case 'TextInputAutoCapitalizeNone':
				return 'none';
			case 'TextInputAutoCapitalizeSentences':
				return 'sentences';
			case 'TextInputAutoCapitalizeWords':
				return 'words';
			default:
				return 'characters';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'autoCapitalize', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$showHideTransition = function (val) {
	var stringValue = function () {
		var _p8 = val;
		if (_p8.ctor === 'StatusBarShowHideTransitionFade') {
			return 'fade';
		} else {
			return 'slide';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'showHideTransition', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$networkActivityIndicatorVisible = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'networkActivityIndicatorVisible',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$barStyle = function (val) {
	var stringValue = function () {
		var _p9 = val;
		if (_p9.ctor === 'StatusBarBarStyleDefault') {
			return 'default';
		} else {
			return 'light-content';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'barStyle', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$translucent = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'translucent',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$animated = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'animated',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$hidden = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'hidden',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$disabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'disabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$maximumTrackTintColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'maximumTrackTintColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$minimumTrackTintColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'minimumTrackTintColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$maximumValue = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'maximumValue',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$minimumValue = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'minimumValue',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$step = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'step',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$sliderValue = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'sliderValue',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$momentary = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'momentary',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$tintColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'tintColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$selectedIndex = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'selectedIndex',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$zoomScale = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'zoomScale',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$removeClippedSubviews = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'removeClippedSubviews',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$snapToAlignment = function (val) {
	var stringValue = function () {
		var _p10 = val;
		switch (_p10.ctor) {
			case 'ScrollViewSnapToAlignmentStart':
				return 'start';
			case 'ScrollViewSnapToAlignmentCenter':
				return 'center';
			default:
				return 'end';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'snapToAlignment', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$snapToInterval = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'snapToInterval',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$showsVerticalScrollIndicator = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'showsVerticalScrollIndicator',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$showsHorizontalScrollIndicator = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'showsHorizontalScrollIndicator',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$sendMomentumEvents = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'sendMomentumEvents',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$scrollsToTop = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'scrollsToTop',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$scrollEventThrottle = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'scrollEventThrottle',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$pagingEnabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'pagingEnabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$minimumZoomScale = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'minimumZoomScale',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$maximumZoomScale = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'maximumZoomScale',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$keyboardShouldPersistTaps = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'keyboardShouldPersistTaps',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$keyboardDismissMode = function (val) {
	var stringValue = function () {
		var _p11 = val;
		switch (_p11.ctor) {
			case 'ScrollViewKeyboardDismissModeNone':
				return 'none';
			case 'ScrollViewKeyboardDismissModeInteractive':
				return 'interactive';
			default:
				return 'on-drag';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'keyboardDismissMode', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$canCancelContentTouches = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'canCancelContentTouches',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$directionalLockEnabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'directionalLockEnabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$indicatorStyle = function (val) {
	var stringValue = function () {
		var _p12 = val;
		switch (_p12.ctor) {
			case 'ScrollViewIndicatorStyleDefault':
				return 'default';
			case 'ScrollViewIndicatorStyleBlack':
				return 'black';
			default:
				return 'white';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'indicatorStyle', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$horizontal = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'horizontal',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$centerContent = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'centerContent',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$alwaysBounceVertical = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'alwaysBounceVertical',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$alwaysBounceHorizontal = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'alwaysBounceHorizontal',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$bouncesZoom = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'bouncesZoom',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$bounces = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'bounces',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$automaticallyAdjustContentInsets = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'automaticallyAdjustContentInsets',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$title = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'title',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$refreshing = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'refreshing',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$trackTintColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'trackTintColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$progressTintColor = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'progressTintColor',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$progressViewStyle = function (val) {
	var stringValue = function () {
		var _p13 = val;
		if (_p13.ctor === 'ProgressViewProgressViewStyleDefault') {
			return 'default';
		} else {
			return 'bar';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'progressViewStyle', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$progress = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'progress',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$prompt = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'prompt',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$mode = function (val) {
	var stringValue = function () {
		var _p14 = val;
		if (_p14.ctor === 'PickerModeDialog') {
			return 'dialog';
		} else {
			return 'dropdown';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'mode', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$enabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'enabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$active = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'active',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$minDelta = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'minDelta',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$maxDelta = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'maxDelta',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$mapType = function (val) {
	var stringValue = function () {
		var _p15 = val;
		switch (_p15.ctor) {
			case 'MapViewMapTypeStandard':
				return 'standard';
			case 'MapViewMapTypeSatellite':
				return 'satellite';
			default:
				return 'hybrid';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'mapType', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$scrollEnabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'scrollEnabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$pitchEnabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'pitchEnabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$rotateEnabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'rotateEnabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$zoomEnabled = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'zoomEnabled',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$showsCompass = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'showsCompass',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$showsPointsOfInterest = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'showsPointsOfInterest',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$followUserLocation = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'followUserLocation',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$showsUserLocation = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'showsUserLocation',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$size = function (val) {
	var stringValue = function () {
		var _p16 = val;
		if (_p16.ctor === 'ActivityIndicatorSizeSmall') {
			return 'small';
		} else {
			return 'large';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'size', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$hidesWhenStopped = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'hidesWhenStopped',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$color = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'color',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$animating = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'animating',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$resizeMode = function (val) {
	var stringValue = function () {
		var _p17 = val;
		switch (_p17.ctor) {
			case 'ImageResizeModeCover':
				return 'cover';
			case 'ImageResizeModeContain':
				return 'contain';
			default:
				return 'stretch';
		}
	}();
	var jsonValue = _elm_lang$core$Json_Encode$string(stringValue);
	return A2(_elm_native_ui$elm_native_ui$NativeUi$property, 'resizeMode', jsonValue);
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$accessibilityLabel = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'accessibilityLabel',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$accessible = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'accessible',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$defaultSource = function (uri) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'defaultSource',
		_elm_lang$core$Json_Encode$object(
			_elm_lang$core$Native_List.fromArray(
				[
					{
					ctor: '_Tuple2',
					_0: 'uri',
					_1: _elm_lang$core$Json_Encode$string(uri)
				}
				])));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$source = function (uri) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'source',
		_elm_lang$core$Json_Encode$object(
			_elm_lang$core$Native_List.fromArray(
				[
					{
					ctor: '_Tuple2',
					_0: 'uri',
					_1: _elm_lang$core$Json_Encode$string(uri)
				}
				])));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$allowFontScaling = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'allowFontScaling',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$testID = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'testID',
		_elm_lang$core$Json_Encode$string(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$suppressHighlighting = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'suppressHighlighting',
		_elm_lang$core$Json_Encode$bool(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$numberOfLines = function (val) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'numberOfLines',
		_elm_lang$core$Json_Encode$float(val));
};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ImageResizeModeStretch = {ctor: 'ImageResizeModeStretch'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ImageResizeModeContain = {ctor: 'ImageResizeModeContain'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ImageResizeModeCover = {ctor: 'ImageResizeModeCover'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ActivityIndicatorSizeLarge = {ctor: 'ActivityIndicatorSizeLarge'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ActivityIndicatorSizeSmall = {ctor: 'ActivityIndicatorSizeSmall'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$MapViewMapTypeHybrid = {ctor: 'MapViewMapTypeHybrid'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$MapViewMapTypeSatellite = {ctor: 'MapViewMapTypeSatellite'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$MapViewMapTypeStandard = {ctor: 'MapViewMapTypeStandard'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$PickerModeDropdown = {ctor: 'PickerModeDropdown'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$PickerModeDialog = {ctor: 'PickerModeDialog'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ProgressViewProgressViewStyleBar = {ctor: 'ProgressViewProgressViewStyleBar'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ProgressViewProgressViewStyleDefault = {ctor: 'ProgressViewProgressViewStyleDefault'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewIndicatorStyleWhite = {ctor: 'ScrollViewIndicatorStyleWhite'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewIndicatorStyleBlack = {ctor: 'ScrollViewIndicatorStyleBlack'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewIndicatorStyleDefault = {ctor: 'ScrollViewIndicatorStyleDefault'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewKeyboardDismissModeOnDrag = {ctor: 'ScrollViewKeyboardDismissModeOnDrag'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewKeyboardDismissModeInteractive = {ctor: 'ScrollViewKeyboardDismissModeInteractive'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewKeyboardDismissModeNone = {ctor: 'ScrollViewKeyboardDismissModeNone'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewSnapToAlignmentEnd = {ctor: 'ScrollViewSnapToAlignmentEnd'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewSnapToAlignmentCenter = {ctor: 'ScrollViewSnapToAlignmentCenter'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ScrollViewSnapToAlignmentStart = {ctor: 'ScrollViewSnapToAlignmentStart'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$StatusBarBarStyleLightContent = {ctor: 'StatusBarBarStyleLightContent'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$StatusBarBarStyleDefault = {ctor: 'StatusBarBarStyleDefault'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$StatusBarShowHideTransitionSlide = {ctor: 'StatusBarShowHideTransitionSlide'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$StatusBarShowHideTransitionFade = {ctor: 'StatusBarShowHideTransitionFade'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputAutoCapitalizeCharacters = {ctor: 'TextInputAutoCapitalizeCharacters'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputAutoCapitalizeWords = {ctor: 'TextInputAutoCapitalizeWords'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputAutoCapitalizeSentences = {ctor: 'TextInputAutoCapitalizeSentences'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputAutoCapitalizeNone = {ctor: 'TextInputAutoCapitalizeNone'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeWebSearch = {ctor: 'TextInputKeyboardTypeWebSearch'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeTwitter = {ctor: 'TextInputKeyboardTypeTwitter'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeDecimalPad = {ctor: 'TextInputKeyboardTypeDecimalPad'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeNamePhonePad = {ctor: 'TextInputKeyboardTypeNamePhonePad'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeNumberPad = {ctor: 'TextInputKeyboardTypeNumberPad'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeUrl = {ctor: 'TextInputKeyboardTypeUrl'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeNumbersAndPunctuation = {ctor: 'TextInputKeyboardTypeNumbersAndPunctuation'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeAsciiCapable = {ctor: 'TextInputKeyboardTypeAsciiCapable'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypePhonePad = {ctor: 'TextInputKeyboardTypePhonePad'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeNumeric = {ctor: 'TextInputKeyboardTypeNumeric'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeEmailAddress = {ctor: 'TextInputKeyboardTypeEmailAddress'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardTypeDefault = {ctor: 'TextInputKeyboardTypeDefault'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardAppearanceDark = {ctor: 'TextInputKeyboardAppearanceDark'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardAppearanceLight = {ctor: 'TextInputKeyboardAppearanceLight'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputKeyboardAppearanceDefault = {ctor: 'TextInputKeyboardAppearanceDefault'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeEmergencyCall = {ctor: 'TextInputReturnKeyTypeEmergencyCall'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeDone = {ctor: 'TextInputReturnKeyTypeDone'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeYahoo = {ctor: 'TextInputReturnKeyTypeYahoo'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeSend = {ctor: 'TextInputReturnKeyTypeSend'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeSearch = {ctor: 'TextInputReturnKeyTypeSearch'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeRoute = {ctor: 'TextInputReturnKeyTypeRoute'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeNext = {ctor: 'TextInputReturnKeyTypeNext'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeJoin = {ctor: 'TextInputReturnKeyTypeJoin'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeGoogle = {ctor: 'TextInputReturnKeyTypeGoogle'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeGo = {ctor: 'TextInputReturnKeyTypeGo'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputReturnKeyTypeDefault = {ctor: 'TextInputReturnKeyTypeDefault'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputClearButtonModeAlways = {ctor: 'TextInputClearButtonModeAlways'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputClearButtonModeUnlessEditing = {ctor: 'TextInputClearButtonModeUnlessEditing'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputClearButtonModeWhileEditing = {ctor: 'TextInputClearButtonModeWhileEditing'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$TextInputClearButtonModeNever = {ctor: 'TextInputClearButtonModeNever'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewAccessibilityLiveRegionAssertive = {ctor: 'ViewAccessibilityLiveRegionAssertive'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewAccessibilityLiveRegionPolite = {ctor: 'ViewAccessibilityLiveRegionPolite'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewAccessibilityLiveRegionNone = {ctor: 'ViewAccessibilityLiveRegionNone'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewImportantForAccessibilityNoHideDescendants = {ctor: 'ViewImportantForAccessibilityNoHideDescendants'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewImportantForAccessibilityNo = {ctor: 'ViewImportantForAccessibilityNo'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewImportantForAccessibilityYes = {ctor: 'ViewImportantForAccessibilityYes'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewImportantForAccessibilityAuto = {ctor: 'ViewImportantForAccessibilityAuto'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewPointerEventsAuto = {ctor: 'ViewPointerEventsAuto'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewPointerEventsBoxOnly = {ctor: 'ViewPointerEventsBoxOnly'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewPointerEventsNone = {ctor: 'ViewPointerEventsNone'};
var _elm_native_ui$elm_native_ui$NativeUi_Properties$ViewPointerEventsBoxNone = {ctor: 'ViewPointerEventsBoxNone'};

var _user$project$App_Color$defaultUnderlay = 'rgba(0,0,0,0.05)';
var _user$project$App_Color$lightHeader = '#9F8AB3';
var _user$project$App_Color$lightGray = '#f8f8f8';
var _user$project$App_Color$black = '#000';
var _user$project$App_Color$white = '#fff';
var _user$project$App_Color$red = '#FF666B';
var _user$project$App_Color$darkPurple = '#402D51';
var _user$project$App_Color$purple = '#5C4570';

var _user$project$App_Font$hkCompakt = 'HK Compakt';
var _user$project$App_Font$roboto = 'Roboto Condensed';

var _user$project$Date_Format$padWith = function (c) {
	return function (_p0) {
		return A3(
			_elm_lang$core$String$padLeft,
			2,
			c,
			_elm_lang$core$Basics$toString(_p0));
	};
};
var _user$project$Date_Format$zero2twelve = function (n) {
	return _elm_lang$core$Native_Utils.eq(n, 0) ? 12 : n;
};
var _user$project$Date_Format$mod12 = function (h) {
	return A2(_elm_lang$core$Basics_ops['%'], h, 12);
};
var _user$project$Date_Format$fullDayOfWeek = function (dow) {
	var _p1 = dow;
	switch (_p1.ctor) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var _user$project$Date_Format$monthToFullName = function (m) {
	var _p2 = m;
	switch (_p2.ctor) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var _user$project$Date_Format$monthToInt = function (m) {
	var _p3 = m;
	switch (_p3.ctor) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var _user$project$Date_Format$formatToken = F2(
	function (d, m) {
		var symbol = function () {
			var _p4 = m.submatches;
			if (((_p4.ctor === '::') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === '[]')) {
				return _p4._0._0;
			} else {
				return ' ';
			}
		}();
		var _p5 = symbol;
		switch (_p5) {
			case '%':
				return '%';
			case 'Y':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$year(d));
			case 'y':
				return A2(
					_elm_lang$core$String$right,
					2,
					_elm_lang$core$Basics$toString(
						_elm_lang$core$Date$year(d)));
			case 'm':
				return A3(
					_elm_lang$core$String$padLeft,
					2,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Basics$toString(
						_user$project$Date_Format$monthToInt(
							_elm_lang$core$Date$month(d))));
			case 'B':
				return _user$project$Date_Format$monthToFullName(
					_elm_lang$core$Date$month(d));
			case 'b':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$month(d));
			case 'd':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$day(d));
			case 'e':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_elm_lang$core$Date$day(d));
			case 'a':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$dayOfWeek(d));
			case 'A':
				return _user$project$Date_Format$fullDayOfWeek(
					_elm_lang$core$Date$dayOfWeek(d));
			case 'H':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$hour(d));
			case 'k':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_elm_lang$core$Date$hour(d));
			case 'I':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_user$project$Date_Format$zero2twelve(
						_user$project$Date_Format$mod12(
							_elm_lang$core$Date$hour(d))));
			case 'l':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_user$project$Date_Format$zero2twelve(
						_user$project$Date_Format$mod12(
							_elm_lang$core$Date$hour(d))));
			case 'p':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					12) < 0) ? 'AM' : 'PM';
			case 'P':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					12) < 0) ? 'am' : 'pm';
			case 'M':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$minute(d));
			case 'S':
				return A2(
					_user$project$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$second(d));
			default:
				return '';
		}
	});
var _user$project$Date_Format$re = _elm_lang$core$Regex$regex('%(%|Y|y|m|B|b|d|e|a|A|H|k|I|l|p|P|M|S)');
var _user$project$Date_Format$format = F2(
	function (s, d) {
		return A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_user$project$Date_Format$re,
			_user$project$Date_Format$formatToken(d),
			s);
	});
var _user$project$Date_Format$formatISO8601 = _user$project$Date_Format$format('%Y-%m-%dT%H:%M:%SZ');

var _user$project$Types$Train = F2(
	function (a, b) {
		return {scheduledArrival: a, predictedArrival: b};
	});
var _user$project$Types$Route = F3(
	function (a, b, c) {
		return {name: a, stops: b, id: c};
	});
var _user$project$Types$RouteStop = F2(
	function (a, b) {
		return {route: a, stop: b};
	});
var _user$project$Types$Outbound = {ctor: 'Outbound'};
var _user$project$Types$Inbound = {ctor: 'Inbound'};

var _user$project$StopPicker_Model$initialModel = {selectedRoute: _elm_lang$core$Maybe$Nothing};
var _user$project$StopPicker_Model$Model = function (a) {
	return {selectedRoute: a};
};

var _user$project$StopPicker_Update$External = function (a) {
	return {ctor: 'External', _0: a};
};
var _user$project$StopPicker_Update$Internal = function (a) {
	return {ctor: 'Internal', _0: a};
};
var _user$project$StopPicker_Update$PickStop = function (a) {
	return {ctor: 'PickStop', _0: a};
};
var _user$project$StopPicker_Update$update = F2(
	function (msg, model) {
		var _p0 = msg;
		if (_p0.ctor === 'PickRoute') {
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					model,
					{
						selectedRoute: _elm_lang$core$Maybe$Just(_p0._0)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					model,
					{selectedRoute: _elm_lang$core$Maybe$Nothing}),
				_1: A2(
					_elm_lang$core$Task$perform,
					function (_p1) {
						return _user$project$StopPicker_Update$External(
							_user$project$StopPicker_Update$PickStop(_p1));
					},
					_elm_lang$core$Task$succeed(_p0._0))
			};
		}
	});
var _user$project$StopPicker_Update$InternalPickStop = function (a) {
	return {ctor: 'InternalPickStop', _0: a};
};
var _user$project$StopPicker_Update$PickRoute = function (a) {
	return {ctor: 'PickRoute', _0: a};
};

var _user$project$Message$ToggleStopPicker = {ctor: 'ToggleStopPicker'};
var _user$project$Message$LoadSchedule = function (a) {
	return {ctor: 'LoadSchedule', _0: a};
};
var _user$project$Message$LoadRoutes = function (a) {
	return {ctor: 'LoadRoutes', _0: a};
};
var _user$project$Message$PickStop = function (a) {
	return {ctor: 'PickStop', _0: a};
};
var _user$project$Message$ChangeDirection = function (a) {
	return {ctor: 'ChangeDirection', _0: a};
};
var _user$project$Message$StopPickerMsg = function (a) {
	return {ctor: 'StopPickerMsg', _0: a};
};

var _user$project$FetchRoutes$decodeStop = _elm_lang$core$Json_Decode$string;
var _user$project$FetchRoutes$decodeStops = _elm_lang$core$Json_Decode$list(_user$project$FetchRoutes$decodeStop);
var _user$project$FetchRoutes$decodeRoute = A3(
	_elm_lang$core$Json_Decode$map2,
	_user$project$Types$Route,
	A2(_elm_lang$core$Json_Decode$field, 'route_name', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'stops', _user$project$FetchRoutes$decodeStops));
var _user$project$FetchRoutes$decodeRoutes = A2(
	_elm_lang$core$Json_Decode$map,
	_elm_lang$core$List$map(
		function (_p0) {
			var _p1 = _p0;
			return _p1._1(_p1._0);
		}),
	_elm_lang$core$Json_Decode$keyValuePairs(_user$project$FetchRoutes$decodeRoute));
var _user$project$FetchRoutes$getRoutes = A2(_elm_lang$http$Http$get, 'https://commuter-api-production.herokuapp.com/api/v1/routes', _user$project$FetchRoutes$decodeRoutes);
var _user$project$FetchRoutes$fetchRoutes = A2(_elm_lang$http$Http$send, _user$project$Message$LoadRoutes, _user$project$FetchRoutes$getRoutes);

var _user$project$Model$prettyTime = _user$project$Date_Format$format('%l:%M %P');
var _user$project$Model$directionName = function (direction) {
	var _p0 = direction;
	if (_p0.ctor === 'Inbound') {
		return 'Inbound';
	} else {
		return 'Outbound';
	}
};
var _user$project$Model$initialModel = {
	direction: _user$project$Types$Inbound,
	schedule: _elm_lang$core$Native_List.fromArray(
		[]),
	routes: _elm_lang$core$Native_List.fromArray(
		[]),
	stopPicker: _user$project$StopPicker_Model$initialModel,
	selectedRouteStop: _elm_lang$core$Maybe$Nothing,
	stopPickerOpen: false
};
var _user$project$Model$Model = F6(
	function (a, b, c, d, e, f) {
		return {direction: a, schedule: b, routes: c, stopPicker: d, selectedRouteStop: e, stopPickerOpen: f};
	});

var _user$project$FetchSchedule$stringToDate = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (val) {
		var _p0 = _elm_lang$core$Date$fromString(val);
		if (_p0.ctor === 'Err') {
			return _elm_lang$core$Json_Decode$fail(_p0._0);
		} else {
			return _elm_lang$core$Json_Decode$succeed(_p0._0);
		}
	},
	_elm_lang$core$Json_Decode$string);
var _user$project$FetchSchedule$decodeTrain = A3(
	_elm_lang$core$Json_Decode$map2,
	_user$project$Types$Train,
	A2(_elm_lang$core$Json_Decode$field, 'scheduled_arrival_utc', _user$project$FetchSchedule$stringToDate),
	A2(_elm_lang$core$Json_Decode$field, 'predicted_arrival_utc', _user$project$FetchSchedule$stringToDate));
var _user$project$FetchSchedule$decodeSchedule = _elm_lang$core$Json_Decode$list(_user$project$FetchSchedule$decodeTrain);
var _user$project$FetchSchedule$getSchedule = F2(
	function (direction, _p1) {
		var _p2 = _p1;
		return A2(
			_elm_lang$http$Http$get,
			A2(
				_elm_lang$core$Basics_ops['++'],
				'https://commuter-api-production.herokuapp.com/api/v1/predictions?direction=',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$Model$directionName(direction),
					A2(
						_elm_lang$core$Basics_ops['++'],
						'&route_id=',
						A2(
							_elm_lang$core$Basics_ops['++'],
							_p2.route.id,
							A2(_elm_lang$core$Basics_ops['++'], '&stop_id=', _p2.stop))))),
			_user$project$FetchSchedule$decodeSchedule);
	});
var _user$project$FetchSchedule$fetchSchedule = F2(
	function (direction, maybeRouteStop) {
		var _p3 = maybeRouteStop;
		if (_p3.ctor === 'Nothing') {
			return _elm_lang$core$Platform_Cmd$none;
		} else {
			return A2(
				_elm_lang$http$Http$send,
				_user$project$Message$LoadSchedule,
				A2(_user$project$FetchSchedule$getSchedule, direction, _p3._0));
		}
	});

var _user$project$StopPicker_Translate$translate = function (_p0) {
	var _p1 = _p0;
	return _user$project$Message$PickStop(_p1._0);
};

var _user$project$Update$update = F2(
	function (msg, model) {
		update:
		while (true) {
			var _p0 = msg;
			switch (_p0.ctor) {
				case 'StopPickerMsg':
					if (_p0._0.ctor === 'External') {
						var _v1 = _user$project$StopPicker_Translate$translate(_p0._0._0),
							_v2 = model;
						msg = _v1;
						model = _v2;
						continue update;
					} else {
						var _p1 = A2(_user$project$StopPicker_Update$update, _p0._0._0, model.stopPicker);
						var updatedStopPicker = _p1._0;
						var stopPickerCmd = _p1._1;
						return {
							ctor: '_Tuple2',
							_0: _elm_lang$core$Native_Utils.update(
								model,
								{stopPicker: updatedStopPicker}),
							_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Message$StopPickerMsg, stopPickerCmd)
						};
					}
				case 'ChangeDirection':
					var _p2 = _p0._0;
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{direction: _p2}),
						_1: A2(_user$project$FetchSchedule$fetchSchedule, _p2, model.selectedRouteStop)
					};
				case 'PickStop':
					var _p3 = _p0._0;
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{
								selectedRouteStop: _elm_lang$core$Maybe$Just(_p3),
								stopPickerOpen: false
							}),
						_1: A2(
							_user$project$FetchSchedule$fetchSchedule,
							model.direction,
							_elm_lang$core$Maybe$Just(_p3))
					};
				case 'LoadRoutes':
					var _p4 = _p0._0;
					if (_p4.ctor === 'Ok') {
						return {
							ctor: '_Tuple2',
							_0: _elm_lang$core$Native_Utils.update(
								model,
								{routes: _p4._0}),
							_1: _elm_lang$core$Platform_Cmd$none
						};
					} else {
						return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
					}
				case 'LoadSchedule':
					var _p5 = _p0._0;
					if (_p5.ctor === 'Ok') {
						return {
							ctor: '_Tuple2',
							_0: _elm_lang$core$Native_Utils.update(
								model,
								{schedule: _p5._0}),
							_1: _elm_lang$core$Platform_Cmd$none
						};
					} else {
						return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
					}
				default:
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{stopPickerOpen: !model.stopPickerOpen}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
			}
		}
	});

var _user$project$StopPicker_View$keyProperty = function (string) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$property,
		'key',
		_elm_lang$core$Json_Encode$string(string));
};
var _user$project$StopPicker_View$routeButton = function (route) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi_Events$onPress(
				_user$project$StopPicker_Update$Internal(
					_user$project$StopPicker_Update$PickRoute(route))),
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$marginVertical(5),
						_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$hkCompakt)
					])),
				_user$project$StopPicker_View$keyProperty(route.name)
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$string(route.name)
			]));
};
var _user$project$StopPicker_View$pickerContainer = _elm_native_ui$elm_native_ui$NativeUi_Elements$view(
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_native_ui$elm_native_ui$NativeUi$style(
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_native_ui$elm_native_ui$NativeUi_Style$width(270),
					_elm_native_ui$elm_native_ui$NativeUi_Style$position('absolute'),
					_elm_native_ui$elm_native_ui$NativeUi_Style$bottom(96),
					_elm_native_ui$elm_native_ui$NativeUi_Style$shadowColor('rgb(49, 33, 64)'),
					_elm_native_ui$elm_native_ui$NativeUi_Style$shadowOpacity(0.2),
					_elm_native_ui$elm_native_ui$NativeUi_Style$shadowRadius(3)
				]))
		]));
var _user$project$StopPicker_View$pickerHeader = function (label) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor(_user$project$App_Color$red),
						_elm_native_ui$elm_native_ui$NativeUi_Style$borderTopLeftRadius(10),
						_elm_native_ui$elm_native_ui$NativeUi_Style$borderTopRightRadius(10),
						_elm_native_ui$elm_native_ui$NativeUi_Style$padding(10)
					]))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$style(
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_native_ui$elm_native_ui$NativeUi_Style$color(_user$project$App_Color$white),
								_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$hkCompakt)
							]))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$string(label)
					]))
			]));
};
var _user$project$StopPicker_View$pickerOptions = _elm_native_ui$elm_native_ui$NativeUi_Elements$scrollView(
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_native_ui$elm_native_ui$NativeUi$style(
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor(_user$project$App_Color$white),
					_elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomLeftRadius(10),
					_elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomRightRadius(10),
					_elm_native_ui$elm_native_ui$NativeUi_Style$padding(10),
					_elm_native_ui$elm_native_ui$NativeUi_Style$height(300)
				]))
		]));
var _user$project$StopPicker_View$routeOptions = function (routes) {
	return _user$project$StopPicker_View$pickerOptions(
		A2(_elm_lang$core$List$map, _user$project$StopPicker_View$routeButton, routes));
};
var _user$project$StopPicker_View$routePicker = function (routes) {
	return _user$project$StopPicker_View$pickerContainer(
		_elm_lang$core$Native_List.fromArray(
			[
				_user$project$StopPicker_View$pickerHeader('Commuter Line'),
				_user$project$StopPicker_View$routeOptions(routes)
			]));
};
var _user$project$StopPicker_View$stopButton = F2(
	function (route, stop) {
		return A2(
			_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_native_ui$elm_native_ui$NativeUi_Events$onPress(
					_user$project$StopPicker_Update$Internal(
						_user$project$StopPicker_Update$InternalPickStop(
							A2(_user$project$Types$RouteStop, route, stop)))),
					_elm_native_ui$elm_native_ui$NativeUi$style(
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_native_ui$elm_native_ui$NativeUi_Style$marginVertical(5),
							_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$hkCompakt)
						]))
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_native_ui$elm_native_ui$NativeUi$string(stop)
				]));
	});
var _user$project$StopPicker_View$stopOptions = function (route) {
	return _user$project$StopPicker_View$pickerOptions(
		A2(
			_elm_lang$core$List$map,
			_user$project$StopPicker_View$stopButton(route),
			route.stops));
};
var _user$project$StopPicker_View$stopPicker = function (route) {
	return _user$project$StopPicker_View$pickerContainer(
		_elm_lang$core$Native_List.fromArray(
			[
				_user$project$StopPicker_View$pickerHeader(
				A2(_elm_lang$core$Basics_ops['++'], route.name, ' Stops')),
				_user$project$StopPicker_View$stopOptions(route)
			]));
};
var _user$project$StopPicker_View$view = F2(
	function (routes, model) {
		var _p0 = model.selectedRoute;
		if (_p0.ctor === 'Just') {
			return _user$project$StopPicker_View$stopPicker(_p0._0);
		} else {
			return _user$project$StopPicker_View$routePicker(routes);
		}
	});

var _user$project$View$stopPickerButton = function (buttonLabel) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor('#674982'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$borderRadius(40),
						_elm_native_ui$elm_native_ui$NativeUi_Style$height(56),
						_elm_native_ui$elm_native_ui$NativeUi_Style$justifyContent('center'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignItems('center'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$position('absolute'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$bottom(20),
						_elm_native_ui$elm_native_ui$NativeUi_Style$width(270)
					]))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$style(
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_native_ui$elm_native_ui$NativeUi_Style$color('#C9B8D7'),
								_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$hkCompakt),
								_elm_native_ui$elm_native_ui$NativeUi_Style$fontWeight('500')
							])),
						_elm_native_ui$elm_native_ui$NativeUi_Events$onPress(_user$project$Message$ToggleStopPicker)
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$string(buttonLabel)
					]))
			]));
};
var _user$project$View$stopPicker = function (model) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi$map,
		_user$project$Message$StopPickerMsg,
		A2(_user$project$StopPicker_View$view, model.routes, model.stopPicker));
};
var _user$project$View$maybeStopPicker = function (model) {
	return model.stopPickerOpen ? _elm_lang$core$Maybe$Just(
		_user$project$View$stopPicker(model)) : _elm_lang$core$Maybe$Nothing;
};
var _user$project$View$stopPickerLabelText = function (_p0) {
	var _p1 = _p0;
	return _p1.stopPickerOpen ? 'Cancel' : A2(
		_elm_lang$core$Maybe$withDefault,
		'Select your home stop',
		A2(
			_elm_lang$core$Maybe$map,
			function (_) {
				return _.stop;
			},
			_p1.selectedRouteStop));
};
var _user$project$View$picker = function (model) {
	var buttonLabel = _user$project$View$stopPickerLabelText(model);
	return A2(
		_elm_lang$core$List$filterMap,
		_elm_lang$core$Basics$identity,
		_elm_lang$core$Native_List.fromArray(
			[
				_user$project$View$maybeStopPicker(model),
				_elm_lang$core$Maybe$Just(
				_user$project$View$stopPickerButton(buttonLabel))
			]));
};
var _user$project$View$routeAndStop = function (model) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$width(270)
					]))
			]),
		_user$project$View$picker(model));
};
var _user$project$View$defaultDirectionStyle = _elm_lang$core$Native_List.fromArray(
	[
		_elm_native_ui$elm_native_ui$NativeUi_Style$flex(1),
		_elm_native_ui$elm_native_ui$NativeUi_Style$padding(20),
		_elm_native_ui$elm_native_ui$NativeUi_Style$textAlign('center'),
		_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$hkCompakt),
		_elm_native_ui$elm_native_ui$NativeUi_Style$fontWeight('400')
	]);
var _user$project$View$directionStyle = F2(
	function (direction, currentDirection) {
		var activeStyle = _elm_lang$core$Native_Utils.eq(direction, currentDirection) ? _elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi_Style$color(_user$project$App_Color$white)
			]) : _elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi_Style$color(_user$project$App_Color$lightHeader)
			]);
		return A2(_elm_lang$core$List$append, _user$project$View$defaultDirectionStyle, activeStyle);
	});
var _user$project$View$directionPicker = function (direction) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$flexDirection('row'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignItems('center'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignSelf('stretch'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$marginTop(20)
					]))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Events$onPress(
						_user$project$Message$ChangeDirection(_user$project$Types$Inbound)),
						_elm_native_ui$elm_native_ui$NativeUi$style(
						A2(_user$project$View$directionStyle, _user$project$Types$Inbound, direction))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$string('To Boston')
					])),
				A2(
				_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Events$onPress(
						_user$project$Message$ChangeDirection(_user$project$Types$Outbound)),
						_elm_native_ui$elm_native_ui$NativeUi$style(
						A2(_user$project$View$directionStyle, _user$project$Types$Outbound, direction))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$string('From Boston')
					]))
			]));
};
var _user$project$View$trainElement = function (train) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$flexDirection('row'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignItems('center'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$justifyContent('space-between'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor('white'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$padding(20),
						_elm_native_ui$elm_native_ui$NativeUi_Style$borderBottomWidth(1),
						_elm_native_ui$elm_native_ui$NativeUi_Style$borderColor(_user$project$App_Color$lightGray)
					]))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$style(
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_native_ui$elm_native_ui$NativeUi_Style$color(_user$project$App_Color$darkPurple),
								_elm_native_ui$elm_native_ui$NativeUi_Style$fontSize(22),
								_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$roboto)
							]))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$string(
						_user$project$Model$prettyTime(train.scheduledArrival))
					])),
				A2(
				_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$style(
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_native_ui$elm_native_ui$NativeUi_Style$color(_user$project$App_Color$darkPurple)
							]))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi$string(
						_user$project$Model$prettyTime(train.predictedArrival))
					]))
			]));
};
var _user$project$View$schedule = function (trains) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignSelf('stretch')
					]))
			]),
		A2(
			_elm_lang$core$List$append,
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_native_ui$elm_native_ui$NativeUi$style(
							_elm_lang$core$Native_List.fromArray(
								[
									_elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor(_user$project$App_Color$white),
									_elm_native_ui$elm_native_ui$NativeUi_Style$color('#9F8AB3'),
									_elm_native_ui$elm_native_ui$NativeUi_Style$fontSize(9),
									_elm_native_ui$elm_native_ui$NativeUi_Style$fontWeight('700'),
									_elm_native_ui$elm_native_ui$NativeUi_Style$letterSpacing(0.25),
									_elm_native_ui$elm_native_ui$NativeUi_Style$paddingTop(18),
									_elm_native_ui$elm_native_ui$NativeUi_Style$textAlign('center')
								]))
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_native_ui$elm_native_ui$NativeUi$string('UPCOMING')
						]))
				]),
			A2(_elm_lang$core$List$map, _user$project$View$trainElement, trains)));
};
var _user$project$View$topSection = function (model) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$flex(1),
						_elm_native_ui$elm_native_ui$NativeUi_Style$flexDirection('column'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignSelf('stretch')
					]))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				_user$project$View$directionPicker(model.direction),
				_user$project$View$schedule(model.schedule)
			]));
};
var _user$project$View$welcomeScreen = A2(
	_elm_native_ui$elm_native_ui$NativeUi_Elements$text,
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_native_ui$elm_native_ui$NativeUi$style(
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_native_ui$elm_native_ui$NativeUi_Style$color('#301d41'),
					_elm_native_ui$elm_native_ui$NativeUi_Style$fontFamily(_user$project$App_Font$hkCompakt),
					_elm_native_ui$elm_native_ui$NativeUi_Style$textAlign('center'),
					_elm_native_ui$elm_native_ui$NativeUi_Style$fontWeight('800'),
					_elm_native_ui$elm_native_ui$NativeUi_Style$marginTop(60),
					_elm_native_ui$elm_native_ui$NativeUi_Style$fontSize(48)
				]))
		]),
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_native_ui$elm_native_ui$NativeUi$string('Purple Train')
		]));
var _user$project$View$mainView = function (model) {
	var _p2 = model.selectedRouteStop;
	if (_p2.ctor === 'Nothing') {
		return _elm_lang$core$Native_List.fromArray(
			[
				_user$project$View$welcomeScreen,
				_user$project$View$routeAndStop(model)
			]);
	} else {
		return _elm_lang$core$Native_List.fromArray(
			[
				_user$project$View$topSection(model),
				_user$project$View$routeAndStop(model)
			]);
	}
};
var _user$project$View$view = function (model) {
	return A2(
		_elm_native_ui$elm_native_ui$NativeUi_Elements$view,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_native_ui$elm_native_ui$NativeUi$style(
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_native_ui$elm_native_ui$NativeUi_Style$flex(1),
						_elm_native_ui$elm_native_ui$NativeUi_Style$flexDirection('column'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$justifyContent('space-between'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$alignItems('center'),
						_elm_native_ui$elm_native_ui$NativeUi_Style$backgroundColor(_user$project$App_Color$darkPurple)
					]))
			]),
		_user$project$View$mainView(model));
};

var _user$project$Main$main = _elm_native_ui$elm_native_ui$NativeUi$program(
	{
		init: {ctor: '_Tuple2', _0: _user$project$Model$initialModel, _1: _user$project$FetchRoutes$fetchRoutes},
		view: _user$project$View$view,
		update: _user$project$Update$update,
		subscriptions: function (_p0) {
			return _elm_lang$core$Platform_Sub$none;
		}
	})();

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
if (typeof _user$project$Main$main !== 'undefined') {
    _user$project$Main$main(Elm['Main'], 'Main', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

