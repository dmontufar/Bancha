/*!
 * Bancha.scaffold.Grid Tests
 * Copyright(c) 2011 Roland Schuetz
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @copyright (c) 2011 Roland Schuetz
 */
/*jslint browser: true, vars: true, plusplus: true, white: true, sloppy: true */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, Mock, BanchaSpecHelper */

describe("Bancha.scaffold.Grid tests",function() { 
    var h = BanchaSpecHelper, // shortcuts
        gridScaf = Bancha.scaffold.Grid,
        // take the defaults
        // (actually this is also copying all the function references, but it doesn't atter)
        testDefaults = Ext.clone(gridScaf);
    
    // force easiert defaults for unit testing
    testDefaults = Ext.apply(testDefaults,{
        enableCreate:  false,
        enableUpdate:  false,
        enableDestroy: false,
        enableReset:   false,
        storeDefaults: {
            autoLoad: false // since we only want to unit-test and not laod data
        }
    });
    
    beforeEach(function() {
        h.reset();
        // re-enforce defaults
        Ext.apply(gridScaf, testDefaults);
    });
    
    

    it("should build column configs while considering the defined defaults", function() {
        // define some defaults
        gridScaf.columnDefaults = {
            forAllFields: 'added'
        };
        gridScaf.gridcolumnDefaults = {
            justForText: true
        };
        gridScaf.datecolumnDefaults = {};

        expect(gridScaf.buildColumnConfig('string','someName')).toEqual({
            forAllFields: 'added',
            justForText: true,
            xtype : 'gridcolumn',
            text: 'Some name',
            dataIndex: 'someName'
        });

        // now there should be just added the first one
        expect(gridScaf.buildColumnConfig('date','someName')).toEqual({
            forAllFields: 'added',
            xtype : 'datecolumn',
            text: 'Some name',
            dataIndex: 'someName'
        });
    });

    it("should build column configs while considering special defaults per call", function() {
        gridScaf.columnDefaults = {
            forAllFields: 'added'
        };
        gridScaf.gridcolumnDefaults = {
            justForText: true
        };
        var defaults = {
            gridcolumnDefaults: {
                justForThisTextBuild: true
            }
        };
        
        expect(gridScaf.buildColumnConfig('string','someName',defaults)).toEqual({
            forAllFields: 'added',
            justForThisTextBuild: true, // <-- old defaults got overrided
            xtype : 'gridcolumn',
            text: 'Some name',
            dataIndex: 'someName'
        });

        // now there should be just added the first one
        expect(gridScaf.buildColumnConfig('date','someName',defaults)).toEqual({
            forAllFields: 'added',
            xtype : 'datecolumn',
            text: 'Some name',
            dataIndex: 'someName'
        });
    });
    
    it("should build a grid column config with #buildColumns (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridColumnsConfigTest');

        // expected columns
        var expected = [{
            flex     : 1,
            xtype    : 'numbercolumn',
            format   : '0',
            text     : 'Id',
            dataIndex: 'id',
            hidden   : true
        }, {
            flex     : 1,
            xtype   : 'gridcolumn',
            text     : 'Name',
            dataIndex: 'name'
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Login',
            dataIndex: 'login'
        }, {
            flex     : 1,
            xtype    : 'datecolumn',
            text     : 'Created',
            dataIndex: 'created'
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Email',
            dataIndex: 'email'
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Avatar',
            dataIndex: 'avatar'
        }, {
            flex     : 1,
            xtype    : 'numbercolumn',
            text     : 'Weight',
            dataIndex: 'weight'
        }, {
            flex     : 1,
            xtype    : 'numbercolumn',
            format   : '0',
            text     : 'Height',
            dataIndex: 'height'
        }];

        // test
        var result = gridScaf.buildColumns('GridColumnsConfigTest');

        // compare
        expect(result).toEqual(expected);
    });
    
    
    it("should build a grid column config with #buildColumns with update "+
        "and delete functions (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridColumnsConfigWithUpdateDeleteTest');

        // expected columns
        var expected = [{
            flex     : 1,
            xtype    : 'numbercolumn',
            format   : '0',
            text     : 'Id',
            dataIndex: 'id',
            field    : undefined,
            hidden   : true
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Name',
            dataIndex: 'name',
            field    : {xtype:'textfield'}
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Login',
            dataIndex: 'login',
            field    : {xtype:'textfield'}
        }, {
            flex     : 1,
            xtype    : 'datecolumn',
            text     : 'Created',
            dataIndex: 'created',
            field    : {xtype:'datefield'}
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Email',
            dataIndex: 'email',
            field    : {xtype:'textfield'}
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Avatar',
            dataIndex: 'avatar',
            field    : {xtype:'textfield'}
        }, {
            flex     : 1,
            xtype    : 'numbercolumn',
            text     : 'Weight',
            dataIndex: 'weight',
            field    : {xtype:'numberfield'}
        }, {
            flex     : 1,
            xtype    : 'numbercolumn',
            format   : '0',
            text     : 'Height',
            dataIndex: 'height',
            field    : {xtype:'numberfield', allowDecimals : false}
        }, {
            xtype:'actioncolumn', 
            width:50,
            items: [{
                icon: 'img/icons/delete.png',
                tooltip: 'Delete',
                handler: gridScaf.onDelete
            }]
        }];

        // test
        var result = gridScaf.buildColumns('GridColumnsConfigWithUpdateDeleteTest', {
            enableUpdate  : true,
            enableDestroy : true
        });

        // compare
        expect(result).toEqual(expected);
    });
    
    
    it("should build a grid panel config with #buildConfig (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridConfigTest');

        // test
        var result = gridScaf.buildConfig('GridConfigTest');

        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass("GridConfigTest");
        
        // just a simple column check, buildColumns is already tested above
        expect(result.columns.length).toEqual(8);
    });
    
    
    it("should build a grid panel config with update and delete support with "+
        "#buildConfig (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridConfigWithUpdateDeleteTest');

        // test
        var result = gridScaf.buildConfig('GridConfigWithUpdateDeleteTest', {
            enableUpdate  : true,
            enableDestroy : true
        });

        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass("GridConfigWithUpdateDeleteTest");
        
        // just a simple column check, buildColumns is already tested above
        expect(result.columns.length).toEqual(9);

        // should have all columns editable
        // (the first is the id-field and therefore is guessed to don't have an editorfield)
        expect(result.columns[1].field.xtype).toEqual("textfield");
        
        // should be editable
        expect(result.selType).toEqual('cellmodel');
        // expect a celleditor plugin for update support
        expect(result).property("plugins.0").toBeOfClass("Ext.grid.plugin.CellEditing");
        // standardwise two clicks are expected for update start
        expect(result).property("plugins.0.clicksToEdit").toEqual(2);
        
        // should have an update button
        expect(result).property("dockedItems.0.items.1.iconCls").toEqual("icon-save");
    });
    
    
    it("should build a grid panel config with full crud support with "+
        "#buildConfig (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridConfigWithCRUDTest');

        // test
        var result = gridScaf.buildConfig('GridConfigWithCRUDTest', {
            enableCreate    : true,
            enableUpdate    : true,
            enableReset : true,
            enableDestroy   : true
        },{
            additionalGridConfig: true
        });

        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass("GridConfigWithCRUDTest");
        
        // just a simple column check, buildColumns is already tested above
        expect(result.columns.length).toEqual(9);

        // should be editable (simple check)
        expect(result.selType).toEqual('cellmodel');
        expect(result.plugins[0]).toBeOfClass("Ext.grid.plugin.CellEditing");
        
        // should have an create button
        var buttons = result.dockedItems[0].items;
        expect(buttons[1].iconCls).toEqual('icon-add');
        
        // should have an reset button
        expect(buttons[2].iconCls).toEqual('icon-reset');
        
        // should have an update button
        expect(buttons[3].iconCls).toEqual("icon-save");
        
        // should have added the additional grid config
        expect(result.additionalGridConfig).toBeTruthy();
    });
    
    
    it("should use class interceptors when building a config (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridConfigWithClassInterceptorsTest');
        
        // the same when defining them on the class
        Ext.apply(gridScaf,{
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            guessColumnConfigs: function(config) {
                config.isAugmented = true;
                return config;
            }
        });
        result = gridScaf.buildConfig('GridConfigWithClassInterceptorsTest');
        
        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);
        
        // guessFieldConfg
        expect(result.columns).toBeAnObject();
        Ext.each(result.columns, function(column) {
            expect(column.isAugmented).toEqual(true);
        });
    });
    
    
    it("should use config interceptors when building a config (component test)", function() {
        // prepare
        h.initAndCreateSampleModel('GridConfigWithConfigInterceptorsTest');
        
        var result = gridScaf.buildConfig('GridConfigWithConfigInterceptorsTest',{
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            guessColumnConfigs: function(config) {
                config.isAugmented = true;
                return config;
            }
        });
        
        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);
        
        // guessFieldConfg
        expect(result.columns).toBeAnObject();
        Ext.each(result.columns, function(column) {
            expect(column.isAugmented).toEqual(true);
        });
    });
    
    it("should create a GridPanel using #createPanel", function() {
        // prepare
        h.initAndCreateSampleModel('GridPanelTest');
        
        // since this function is just a wrapper for #buildConfig,
        // just test that it returns an grid panel

        expect(gridScaf.createPanel('GridPanelTest')).toBeOfClass('Ext.grid.Panel');
    });
}); //eo scaffold grid functions

// eof
