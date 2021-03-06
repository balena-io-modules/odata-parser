assert = require 'assert'

module.exports = (test) ->
	describe '$orderby', ->
		test '$orderby=Property', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have the property specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'Property')

		test '$orderby=PropertyOne,PropertyTwo', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have the first property specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
			it 'sort options have the second property specified', ->
				assert.equal(result.options.$orderby.properties[1].name, 'PropertyTwo')


		test '$orderby=PropertyOne desc', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have the property specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
			it 'sort options have the property ordering specified', ->
				assert.equal(result.options.$orderby.properties[0].order, 'desc')


		test '$orderby=PropertyOne%20desc', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have the property specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
			it 'sort options have the property ordering specified', ->
				assert.equal(result.options.$orderby.properties[0].order, 'desc')


		test '$orderby=PropertyOne asc', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have the property specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
			it 'sort options have the property ordering specified', ->
				assert.equal(result.options.$orderby.properties[0].order, 'asc')

		test '$orderby=PropertyOne asc,PropertyTwo desc', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have property one name specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
			it 'sort options have property one ordering specified', ->
				assert.equal(result.options.$orderby.properties[0].order, 'asc')
			it 'sort options have the property two name specified', ->
				assert.equal(result.options.$orderby.properties[1].name, 'PropertyTwo')
			it 'sort options have the property two ordering specified', ->
				assert.equal(result.options.$orderby.properties[1].order, 'desc')

		test '$orderby=PropertyOne/SubProperty', (result) ->
			it 'sort options are present on the result', ->
				assert.notEqual(result.options.$orderby, null)
			it 'sort options have property one name specified', ->
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
			it "sort options have property one's sub property specified", ->
				assert.equal(result.options.$orderby.properties[0].property.name, 'SubProperty')
