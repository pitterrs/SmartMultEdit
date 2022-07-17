sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageToast, ODataModel, ResourceModel, syncStyleClass, Fragment) {
    "use strict";

    return BaseController.extend("com.br.grupoboticario.prorrogacaofree.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel, oModel, oTable, oView;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

            oModel = new ODataModel("/sap/opu/odata/sap/ZUI_PRORROGA/", true);
			oModel.setDefaultBindingMode("TwoWay");
			oView = this.getView();
			oView.setModel(oModel);

			oTable = this.getView().byId("table").getTable();
			oTable.setMode("MultiSelect");
			oTable.attachSelectionChange(this.onTableSelection, this);

			this.oResouceModel = new ResourceModel({
				bundleName: "sap.ui.comp.sample.smartmultiedit.messagebundle"
			});
			oView.setModel(this.oResouceModel, "@i18n");
            
        },

        onOpenMultiEdit: function() {
			Fragment.load({
				name: "com.br.grupoboticario.prorrogacaofree.view.MultiEditDialog",
				controller: this
			}).then(function(oFragment) {
				this.oMultiEditDialog = oFragment;
				this.getView().addDependent(this.oMultiEditDialog);

				this.oMultiEditDialog.setEscapeHandler(function() {
					this.onCloseDialog();
				}.bind(this));

				this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("table").getTable().getSelectedContexts());
				syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
				this.oMultiEditDialog.open();
			}.bind(this));
		},

		onCloseDialog: function() {
			this.oMultiEditDialog.close();
			this.oMultiEditDialog.destroy();
			this.oMultiEditDialog = null;
		},

		onTableSelection: function () {
			var aSelectedItems = this.getView().byId("table").getTable().getSelectedItems();
			this.getView().byId("btnMultiEdit").setEnabled(aSelectedItems.length > 0);
		},

		onDialogSaveButton: function () {
			var oMultiEditContainer = this.oMultiEditDialog.getContent()[0];

			this.oMultiEditDialog.setBusy(true);
			oMultiEditContainer.getErroneousFieldsAndTokens().then(function (aErrorFields) {
				this.oMultiEditDialog.setBusy(false);
				if (aErrorFields.length === 0) {
					this._saveChanges();
				}
			}.bind(this)).catch(function () {
				this.oMultiEditDialog.setBusy(false);
			}.bind(this));
		},

		_saveChanges: function () {
			var oMultiEditContainer = this.oMultiEditDialog.getContent()[0],
				that = this,
				aUpdatedContexts,
				oContext,
				oUpdatedData,
				oObjectToUpdate,
				oUpdatedDataCopy;

			var fnHandler = function (oField) {
				var sPropName = oField.getPropertyName(),
					sUomPropertyName = oField.getUnitOfMeasurePropertyName();
				if (!oField.getApplyToEmptyOnly() || !oObjectToUpdate[sPropName]
					|| (typeof oObjectToUpdate[sPropName] == "string" && !oObjectToUpdate[sPropName].trim())) {
					oUpdatedDataCopy[sPropName] = oUpdatedData[sPropName];
				}
				if (oField.isComposite()) {
					if (!oField.getApplyToEmptyOnly() || !oObjectToUpdate[sUomPropertyName]) {
						oUpdatedDataCopy[sUomPropertyName] = oUpdatedData[sUomPropertyName];
					}
				}
			};

			MessageToast.show("Save action started", {
				onClose: function () {
					oMultiEditContainer.getAllUpdatedContexts(true).then(function(result) {
						MessageToast.show("Updated contexts available", {
							onClose: function () {
								aUpdatedContexts = result;
								for (var i = 0; i < aUpdatedContexts.length; i++) {
									oContext = aUpdatedContexts[i].context;
									oUpdatedData = aUpdatedContexts[i].data;
									oObjectToUpdate = oContext.getModel().getObject(oContext.getPath());
									oUpdatedDataCopy = {};
									this._getFields().filter(function (oField) {
										return !oField.isKeepExistingSelected();
									}).forEach(fnHandler);
									oContext.getModel().update(oContext.getPath(), oUpdatedDataCopy);
								}
								MessageToast.show("Model was updated");

								that.onCloseDialog();
							}.bind(this)
						});
					}.bind(oMultiEditContainer));
				}
			});
			this.oMultiEditDialog.close();
		},

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("BELNR", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/zce_prorroga_vencimento".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        },

        onSave: function (oEvent) 
        {
        //  this.getModel().submitChanges
        //  ({
        //     success:function()
        //     {
        //         var message = this.getView().getModel("i18n").getResourceBundle().getText('msgSaveSuccessfull');
        //         MessageToast.show(message);
        //     }.bind(this), error:function()
        //     {
        //     }
        // });

        var oModel = this.getView().getModel();//gets the v2 odata model
        oModel.setUseBatch(true);//setting batch true if not already set
        var jModel = oTable.getModel("worklistView").getProperty("/BUZEI");

        for (var i = 0; i < jModel.length; i++) {
            var oEntry = jModel[i];
            oModel.create("/zce_prorroga_vencimento", oEntry, {
                method: "POST",
                success: function(data) {

                },
                error: function(e) {

                }
            });

        }
        oModel.submitChanges({
            success: function(data, response) {
                //To do
            },
            error: function(e) {
                //To do
            }
        });
            
        },
        
        onEditPromotionsPressed: function(oEvent){
            var saveBtn = this.getView().byId("btnSave");
            if(saveBtn.getVisible()) {
                saveBtn.setVisible(false);
            } else {
                saveBtn.setVisible(true);
            }
        }

    });
});
