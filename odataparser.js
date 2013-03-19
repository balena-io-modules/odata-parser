(function(root, factory) {
    "function" == typeof define && define.amd ? define([ "exports", "ometa-core" ], factory) : "object" == typeof exports ? factory(exports, require("ometa-js").core) : factory(root, root.OMeta);
})(this, function(exports, OMeta) {
    var ODataParser = OMeta._extend({
        Number: function() {
            var $elf = this, _fromIdx = this.input.idx, d;
            d = this._consumedBy(function() {
                return this._many1(function() {
                    return this._apply("digit");
                });
            });
            return parseInt(d, 10);
        },
        Text: function() {
            var $elf = this, _fromIdx = this.input.idx, text;
            text = this._consumedBy(function() {
                return this._many(function() {
                    this._not(function() {
                        return this._applyWithArgs("exactly", "'");
                    });
                    return this._or(function() {
                        return function() {
                            switch (this._apply("anything")) {
                              case "\\":
                                return this._apply("anything");

                              default:
                                throw this._fail();
                            }
                        }.call(this);
                    }, function() {
                        return this._apply("letter");
                    });
                });
            });
            return text;
        },
        QuotedText: function() {
            var $elf = this, _fromIdx = this.input.idx, t;
            this._applyWithArgs("exactly", "'");
            t = this._apply("Text");
            this._applyWithArgs("exactly", "'");
            return t;
        },
        OData: function() {
            var $elf = this, _fromIdx = this.input.idx, model, options;
            return this._or(function() {
                model = this._apply("PathSegment");
                this._opt(function() {
                    this._applyWithArgs("exactly", "?");
                    return options = this._applyWithArgs("listOf", "QueryOption", "&");
                });
                return function() {
                    if (options) {
                        model.options = {};
                        for (var i in options) model.options[options[i].name] = options[i].value;
                    }
                    return model;
                }.call(this);
            }, function() {
                return function() {
                    switch (this._apply("anything")) {
                      case "/":
                        return "/";

                      default:
                        throw this._fail();
                    }
                }.call(this);
            });
        },
        QueryOption: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("SortOption");
            }, function() {
                return this._apply("TopOption");
            }, function() {
                return this._apply("SkipOption");
            }, function() {
                return this._apply("InlineCountOption");
            }, function() {
                return this._apply("FilterByOption");
            }, function() {
                return this._apply("OperationParam");
            });
        },
        OperationParam: function() {
            var $elf = this, _fromIdx = this.input.idx, name, value;
            name = this._apply("Text");
            this._applyWithArgs("exactly", "=");
            value = this._apply("Text");
            return {
                name: name,
                value: value
            };
        },
        SortOption: function() {
            var $elf = this, _fromIdx = this.input.idx, properties;
            this._applyWithArgs("exactly", "$");
            this._applyWithArgs("exactly", "o");
            this._applyWithArgs("exactly", "r");
            this._applyWithArgs("exactly", "d");
            this._applyWithArgs("exactly", "e");
            this._applyWithArgs("exactly", "r");
            this._applyWithArgs("exactly", "b");
            this._applyWithArgs("exactly", "y");
            this._applyWithArgs("exactly", "=");
            properties = this._applyWithArgs("listOf", "SortProperty", ",");
            return {
                name: "$orderby",
                value: {
                    properties: properties
                }
            };
        },
        SortProperty: function() {
            var $elf = this, _fromIdx = this.input.idx, order, property;
            property = this._apply("PropertyPath");
            order = this._opt(function() {
                return function() {
                    switch (this._apply("anything")) {
                      case " ":
                        return function() {
                            switch (this._apply("anything")) {
                              case "a":
                                return function() {
                                    this._applyWithArgs("exactly", "s");
                                    this._applyWithArgs("exactly", "c");
                                    return "asc";
                                }.call(this);

                              case "d":
                                return function() {
                                    this._applyWithArgs("exactly", "e");
                                    this._applyWithArgs("exactly", "s");
                                    this._applyWithArgs("exactly", "c");
                                    return "desc";
                                }.call(this);

                              default:
                                throw this._fail();
                            }
                        }.call(this);

                      default:
                        throw this._fail();
                    }
                }.call(this);
            });
            return function() {
                property.order = order;
                return property;
            }.call(this);
        },
        TopOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("exactly", "$");
            this._applyWithArgs("exactly", "t");
            this._applyWithArgs("exactly", "o");
            this._applyWithArgs("exactly", "p");
            this._applyWithArgs("exactly", "=");
            value = this._apply("Number");
            return {
                name: "$top",
                value: value
            };
        },
        SkipOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("exactly", "$");
            this._applyWithArgs("exactly", "s");
            this._applyWithArgs("exactly", "k");
            this._applyWithArgs("exactly", "i");
            this._applyWithArgs("exactly", "p");
            this._applyWithArgs("exactly", "=");
            value = this._apply("Number");
            return {
                name: "$skip",
                value: value
            };
        },
        InlineCountOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("exactly", "$");
            this._applyWithArgs("exactly", "i");
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "l");
            this._applyWithArgs("exactly", "i");
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "e");
            this._applyWithArgs("exactly", "c");
            this._applyWithArgs("exactly", "o");
            this._applyWithArgs("exactly", "u");
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "t");
            this._applyWithArgs("exactly", "=");
            value = this._or(function() {
                return function() {
                    switch (this._apply("anything")) {
                      case "a":
                        return function() {
                            this._applyWithArgs("exactly", "l");
                            this._applyWithArgs("exactly", "l");
                            this._applyWithArgs("exactly", "p");
                            this._applyWithArgs("exactly", "a");
                            this._applyWithArgs("exactly", "g");
                            this._applyWithArgs("exactly", "e");
                            this._applyWithArgs("exactly", "s");
                            return "allpages";
                        }.call(this);

                      case "n":
                        return function() {
                            this._applyWithArgs("exactly", "o");
                            this._applyWithArgs("exactly", "n");
                            this._applyWithArgs("exactly", "e");
                            return "none";
                        }.call(this);

                      default:
                        throw this._fail();
                    }
                }.call(this);
            }, function() {
                this._apply("Text");
                return "";
            });
            return {
                name: "$inlinecount",
                value: value
            };
        },
        FilterByOption: function() {
            var $elf = this, _fromIdx = this.input.idx, expr;
            this._applyWithArgs("exactly", "$");
            this._applyWithArgs("exactly", "f");
            this._applyWithArgs("exactly", "i");
            this._applyWithArgs("exactly", "l");
            this._applyWithArgs("exactly", "t");
            this._applyWithArgs("exactly", "e");
            this._applyWithArgs("exactly", "r");
            this._applyWithArgs("exactly", "b");
            this._applyWithArgs("exactly", "y");
            this._applyWithArgs("exactly", "=");
            expr = this._apply("FilterByExpression");
            return {
                name: "$filterby",
                value: expr
            };
        },
        FilterByExpression: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._apply("FilterAndExpression");
        },
        FilterAndExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterAndExpression");
                op = this._apply("FilterAndOperand");
                rhs = this._apply("FilterLogicalExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterLogicalExpression");
            });
        },
        FilterLogicalExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterLogicalExpression");
                op = this._apply("FilterByOperand");
                rhs = this._apply("FilterAddExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterAddExpression");
            });
        },
        FilterSubExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, rhs;
            return this._or(function() {
                lhs = this._apply("FilterSubExpression");
                this._apply("spaces");
                this._applyWithArgs("exactly", "s");
                this._applyWithArgs("exactly", "u");
                this._applyWithArgs("exactly", "b");
                this._apply("spaces");
                rhs = this._apply("FilterAddExpression");
                return [ "sub", lhs, rhs ];
            }, function() {
                return this._apply("FilterAddExpression");
            });
        },
        FilterAddExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, rhs;
            return this._or(function() {
                lhs = this._apply("FilterAddExpression");
                this._apply("spaces");
                this._applyWithArgs("exactly", "a");
                this._applyWithArgs("exactly", "d");
                this._applyWithArgs("exactly", "d");
                this._apply("spaces");
                rhs = this._apply("FilterModExpression");
                return [ "add", lhs, rhs ];
            }, function() {
                return this._apply("FilterModExpression");
            });
        },
        FilterModExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, rhs;
            return this._or(function() {
                lhs = this._apply("FilterModExpression");
                this._apply("spaces");
                this._applyWithArgs("exactly", "m");
                this._applyWithArgs("exactly", "o");
                this._applyWithArgs("exactly", "d");
                this._apply("spaces");
                rhs = this._apply("FilterDivExpression");
                return [ "mod", lhs, rhs ];
            }, function() {
                return this._apply("FilterDivExpression");
            });
        },
        FilterDivExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, rhs;
            return this._or(function() {
                lhs = this._apply("FilterDivExpression");
                this._apply("spaces");
                this._applyWithArgs("exactly", "d");
                this._applyWithArgs("exactly", "i");
                this._applyWithArgs("exactly", "v");
                this._apply("spaces");
                rhs = this._apply("FilterMulExpression");
                return [ "div", lhs, rhs ];
            }, function() {
                return this._apply("FilterMulExpression");
            });
        },
        FilterMulExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, rhs;
            return this._or(function() {
                lhs = this._apply("FilterMulExpression");
                this._apply("spaces");
                this._applyWithArgs("exactly", "m");
                this._applyWithArgs("exactly", "u");
                this._applyWithArgs("exactly", "l");
                this._apply("spaces");
                rhs = this._apply("FilterByValue");
                return [ "mul", lhs, rhs ];
            }, function() {
                return this._apply("FilterByValue");
            });
        },
        FilterByValue: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("FilterMethodCallExpression");
            }, function() {
                return this._apply("FilterNegateExpression");
            }, function() {
                return this._apply("Number");
            }, function() {
                return this._apply("QuotedText");
            }, function() {
                return this._apply("PropertyPath");
            }, function() {
                return this._apply("GroupedPrecedenceExpression");
            });
        },
        GroupedPrecedenceExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, expr;
            this._applyWithArgs("token", "(");
            this._apply("spaces");
            expr = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("token", ")");
            return expr;
        },
        FilterAndOperand: function() {
            var $elf = this, _fromIdx = this.input.idx, op;
            this._apply("spaces");
            op = function() {
                switch (this._apply("anything")) {
                  case "a":
                    return function() {
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "d");
                        return "and";
                    }.call(this);

                  case "o":
                    return function() {
                        this._applyWithArgs("exactly", "r");
                        return "or";
                    }.call(this);

                  default:
                    throw this._fail();
                }
            }.call(this);
            this._apply("spaces");
            return op;
        },
        FilterByOperand: function() {
            var $elf = this, _fromIdx = this.input.idx, op;
            this._apply("spaces");
            op = function() {
                switch (this._apply("anything")) {
                  case "e":
                    return function() {
                        this._applyWithArgs("exactly", "q");
                        return "eq";
                    }.call(this);

                  case "g":
                    return function() {
                        switch (this._apply("anything")) {
                          case "e":
                            return "ge";

                          case "t":
                            return "gt";

                          default:
                            throw this._fail();
                        }
                    }.call(this);

                  case "l":
                    return function() {
                        switch (this._apply("anything")) {
                          case "e":
                            return "le";

                          case "t":
                            return "lt";

                          default:
                            throw this._fail();
                        }
                    }.call(this);

                  case "n":
                    return function() {
                        this._applyWithArgs("exactly", "e");
                        return "ne";
                    }.call(this);

                  default:
                    throw this._fail();
                }
            }.call(this);
            this._apply("spaces");
            return op;
        },
        FilterNegateExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, expr, value;
            this._apply("spaces");
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "o");
            this._applyWithArgs("exactly", "t");
            this._apply("spaces");
            value = this._or(function() {
                return this._apply("FilterByValue");
            }, function() {
                return function() {
                    switch (this._apply("anything")) {
                      case "(":
                        return function() {
                            this._apply("spaces");
                            expr = this._apply("FilterByExpression");
                            this._apply("spaces");
                            this._applyWithArgs("exactly", ")");
                            return expr;
                        }.call(this);

                      default:
                        throw this._fail();
                    }
                }.call(this);
            });
            return [ "not", value ];
        },
        FilterMethodCallExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, method;
            method = this._or(function() {
                return this._apply("SubstringOfMethodCall");
            }, function() {
                return this._apply("EndsWithMethodCall");
            }, function() {
                return this._apply("StartsWithMethodCall");
            }, function() {
                return this._apply("LengthMethodCall");
            }, function() {
                return this._apply("IndexOfMethodCall");
            }, function() {
                return this._apply("ReplaceMethodCall");
            }, function() {
                return this._apply("SubstringMethodCall");
            }, function() {
                return this._apply("TolowerMethodCall");
            }, function() {
                return this._apply("ToupperMethodCall");
            }, function() {
                return this._apply("TrimMethodCall");
            }, function() {
                return this._apply("ConcatMethodCall");
            }, function() {
                return this._apply("DayMethodCall");
            }, function() {
                return this._apply("HourMethodCall");
            }, function() {
                return this._apply("MinuteMethodCall");
            }, function() {
                return this._apply("MonthMethodCall");
            }, function() {
                return this._apply("SecondMethodCall");
            }, function() {
                return this._apply("YearMethodCall");
            }, function() {
                return this._apply("RoundMethodCall");
            }, function() {
                return this._apply("FloorMethodCall");
            }, function() {
                return this._apply("CeilingMethodCall");
            }, function() {
                return this._apply("IsOfMethodCall");
            });
            return [ "call", method ];
        },
        SubstringOfMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("TwoArgMethodCall", "substringof");
        },
        EndsWithMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("TwoArgMethodCall", "endswith");
        },
        StartsWithMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("TwoArgMethodCall", "startswith");
        },
        LengthMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "length");
        },
        IndexOfMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("TwoArgMethodCall", "indexof");
        },
        ReplaceMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("ThreeArgMethodCall", "replace");
        },
        SubstringMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._applyWithArgs("TwoArgMethodCall", "substring");
            }, function() {
                return this._applyWithArgs("ThreeArgMethodCall", "substring");
            });
        },
        TolowerMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "tolower");
        },
        ToupperMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "toupper");
        },
        TrimMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "trim");
        },
        ConcatMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "concat");
        },
        DayMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("TwoArgMethodCall", "day");
        },
        HourMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "hour");
        },
        MinuteMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "minute");
        },
        MonthMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "month");
        },
        SecondMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "second");
        },
        YearMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "year");
        },
        RoundMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "round");
        },
        FloorMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "floor");
        },
        CeilingMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("SingleArgMethodCall", "ceiling");
        },
        IsOfMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._applyWithArgs("SingleArgMethodCall", "isof");
            }, function() {
                return this._applyWithArgs("TwoArgMethodCall", "isof");
            });
        },
        SingleArgMethodCall: function(name) {
            var $elf = this, _fromIdx = this.input.idx, one;
            this._applyWithArgs("seq", name);
            this._applyWithArgs("exactly", "(");
            this._apply("spaces");
            one = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ")");
            return {
                args: [ one ],
                method: name
            };
        },
        TwoArgMethodCall: function(name) {
            var $elf = this, _fromIdx = this.input.idx, one, two;
            this._applyWithArgs("seq", name);
            this._applyWithArgs("exactly", "(");
            this._apply("spaces");
            one = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ",");
            this._apply("spaces");
            two = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ")");
            return {
                args: [ one, two ],
                method: name
            };
        },
        ThreeArgMethodCall: function(name) {
            var $elf = this, _fromIdx = this.input.idx, one, three, two;
            this._applyWithArgs("seq", name);
            this._applyWithArgs("exactly", "(");
            this._apply("spaces");
            one = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ",");
            this._apply("spaces");
            two = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ",");
            this._apply("spaces");
            three = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ")");
            return {
                args: [ one, two, three ],
                method: name
            };
        },
        PropertyPath: function() {
            var $elf = this, _fromIdx = this.input.idx, next, resource;
            resource = this._apply("ResourceName");
            this._opt(function() {
                this._applyWithArgs("exactly", "/");
                return next = this._apply("PropertyPath");
            });
            return {
                name: resource,
                property: next
            };
        },
        PathSegment: function() {
            var $elf = this, _fromIdx = this.input.idx, key, link, next, resource;
            this._applyWithArgs("exactly", "/");
            resource = this._apply("ResourceName");
            this._opt(function() {
                this._applyWithArgs("token", "(");
                key = this._apply("Number");
                return this._applyWithArgs("token", ")");
            });
            this._opt(function() {
                return this._or(function() {
                    return function() {
                        switch (this._apply("anything")) {
                          case "/":
                            return function() {
                                this._applyWithArgs("exactly", "$");
                                this._applyWithArgs("exactly", "l");
                                this._applyWithArgs("exactly", "i");
                                this._applyWithArgs("exactly", "n");
                                this._applyWithArgs("exactly", "k");
                                this._applyWithArgs("exactly", "s");
                                return link = this._apply("PathSegment");
                            }.call(this);

                          default:
                            throw this._fail();
                        }
                    }.call(this);
                }, function() {
                    return next = this._apply("PathSegment");
                });
            });
            return {
                resource: resource,
                key: key,
                link: link,
                property: next
            };
        },
        ResourcePart: function() {
            var $elf = this, _fromIdx = this.input.idx, resourcePart;
            resourcePart = this._consumedBy(function() {
                return this._many1(function() {
                    return this._or(function() {
                        return this._apply("letter");
                    }, function() {
                        return function() {
                            switch (this._apply("anything")) {
                              case "_":
                                return "_";

                              default:
                                throw this._fail();
                            }
                        }.call(this);
                    });
                });
            });
            return resourcePart.replace(RegExp("_", "g"), " ");
        },
        ResourceName: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._consumedBy(function() {
                this._apply("ResourcePart");
                return this._many(function() {
                    this._applyWithArgs("exactly", "-");
                    return this._apply("ResourcePart");
                });
            });
        }
    });
    exports.ODataParser = ODataParser;
});
