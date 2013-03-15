(function(root, factory) {
    "function" == typeof define && define.amd ? define([ "exports", "ometa-core" ], factory) : "object" == typeof exports ? factory(exports, require("ometa-js").core) : factory(root, root.OMeta);
})(this, function(exports, OMeta) {
    var ODataParser = OMeta._extend({
        OData: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("ResourceUri");
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
        ResourceUri: function() {
            var $elf = this, _fromIdx = this.input.idx, resource;
            this._applyWithArgs("exactly", "/");
            resource = this._apply("ResourceName");
            this._applyWithArgs("setResource", resource);
            return {
                resource: this.resource
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
    ODataParser.setResource = function(resource) {
        this.resource = resource;
    };
    exports.ODataParser = ODataParser;
});
