/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/Edit.js"/>
/// <reference path="../../Format.js"/>

Ext.namespace("Mobile.SalesLogix.Opportunity");

(function() {
    var U = Sage.Platform.Mobile.Utility;
    
    Mobile.SalesLogix.Opportunity.Edit = Ext.extend(Sage.Platform.Mobile.Edit, {
        //Localization
        accountText: 'acct',
        acctMgrText: 'acct mgr',
        estCloseText: 'est close',
        importSourceText: 'lead source',
        opportunityProbabilityTitle: 'Opportunity Probability',
        opportunityStatusTitle: 'Opportunity Status',
        opportunityText: 'opportunity',
        opportunityTypeTitle: 'Opportunity Type',
        ownerText: 'owner',
        potentialText: 'sales potential',
        probabilityText: 'close prob',
        resellerText: 'reseller',
        statusText: 'status',
        titleText: 'Opportunity',
        typeText: 'type',

        //View Properties
        entityName: 'Opportunity',
        id: 'opportunity_edit',
        querySelect: [
            'Account/AccountName',
            'AccountManager/UserInfo/FirstName',
            'AccountManager/UserInfo/LastName',
            'CloseProbability',
            'Description',
            'EstimatedClose',
            'LeadSource/Description',
            'Owner/OwnerDescription',
            'Reseller/AccountName',
            'SalesPotential',
            'Stage',
            'Status',
            'Type',
            'Weighted'
        ],
        resourceKind: 'opportunities',

        show: function(options) {
            Mobile.SalesLogix.Opportunity.Edit.superclass.show.apply(this, arguments);

            if (options.insert === true) this.applyContext();
        },
        applyContext: function() {
            var found = App.queryNavigationContext(function(o) {
                return /^(accounts|contacts)$/.test(o.resourceKind) && o.key;
            });

            var lookup = {
                'accounts': this.applyAccountContext,
                'contacts': this.applyContactContext
            };

            if (found && lookup[found.resourceKind]) lookup[found.resourceKind].call(this, found);
        },
        applyAccountContext: function(context) {
            var view = App.getView(context.id),
                entry = view && view.entry;

            this.fields['Account'].setValue(entry);
            this.fields['AccountManager'].setValue(U.getValue(entry, 'AccountManager'));
            this.fields['Owner'].setValue(U.getValue(entry, 'Owner'));
        },
        applyContactContext: function(context) {
            var view = App.getView(context.id),
                entry = view && view.entry;

            this.fields['Account'].setValue(U.getValue(entry, 'Account'));
            this.fields['AccountManager'].setValue(U.getValue(entry, 'AccountManager'));
            this.fields['Owner'].setValue(U.getValue(entry, 'Owner'));
        },
        init: function() {
            Mobile.SalesLogix.Opportunity.Edit.superclass.init.apply(this, arguments);

            this.fields['Account'].on('change', this.onAccountChange, this);
        },
        onAccountChange: function(value, field) {
            var selection = field.getSelection();

            // todo: match behavior in web client; if the account manager (AM) is explicitly set, it should stay, otherwise
            // it should be set to the AM for the selected account (and change each time).
            if (selection && this.insert)
            {
                this.fields['AccountManager'].setValue(U.getValue(selection, 'AccountManager'));
            }   
        },
        createLayout: function() {
            // todo: add account on change handling

            return this.layout || (this.layout = [
                {
                    label: this.opportunityText,
                    name: 'Description',
                    type: 'text',
                    validator: Mobile.SalesLogix.Validator.hasText
                },
                {
                    label: this.accountText,
                    name: 'Account',
                    textProperty: 'AccountName',
                    type: 'lookup',
                    validator: Mobile.SalesLogix.Validator.exists,
                    view: 'account_lookup'
                },
                {
                    label: this.acctMgrText,
                    name: 'AccountManager',
                    textProperty: 'UserInfo',
                    textTemplate: Mobile.SalesLogix.Template.nameLF,
                    type: 'lookup',
                    view: 'user_list'
                },
                {
                    label: this.resellerText,
                    name: 'Reseller',
                    textProperty: 'AccountName',
                    type: 'lookup',
                    view: 'account_lookup'
                },
                {
                    label: this.estCloseText,
                    name: 'EstimatedClose',
                    type: 'date'
                },
                {
                    label: this.potentialText,
                    name: 'SalesPotential',
                    precision: 2,
                    type: 'decimal',
                    validationTrigger: 'keyup',
                    validator: Mobile.SalesLogix.Validator.isCurrency
                },
                {
                    label: this.typeText,
                    name: 'Type',
                    picklist: 'Opportunity Type',
                    title: 'Opportunity Type',
                    type: 'picklist'
                },
                {
                    label: this.statusText,
                    name: 'Status',
                    picklist: 'Opportunity Status',
                    requireSelection: true,
                    title: this.opportunityStatusTitle,
                    type: 'picklist'
                },
                {
                    label: this.importSourceText,
                    name: 'LeadSource',
                    textProperty: 'Description',
                    type: 'lookup',
                    view: 'leadsource_list'
                },
                {
                    label: this.ownerText,
                    name: 'Owner',
                    keyProperty: '$key',
                    textProperty: 'OwnerDescription',
                    type: 'lookup',
                    validator: Mobile.SalesLogix.Validator.exists,
                    view: 'owner_list'
                },
                {
                    label: this.probabilityText,
                    name: 'CloseProbability',
                    picklist: 'Opportunity Probability',
                    title: this.opportunityProbabilityTitle,
                    type: 'picklist'
                }
            ]);
        }
    });
})();