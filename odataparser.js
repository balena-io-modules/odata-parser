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
