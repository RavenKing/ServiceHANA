import React from "react"
import {Icon,Card,Form,Button,Select,Radio,Steps,message} from "antd"

import CreateCardStep0 from "./createCard/CreateCardStep0";
import CreateCardStep1 from "./createCard/CreateCardStep1";
import CreateCardStep2 from "./createCard/CreateCardStep2";
import CreateCardStep3 from "./createCard/CreateCardStep3";
var global =window ; 
var pageStatusDataStore = window.pageStatusDataStore;
var displayAreaChangeActions=window.displayAreaChangeActions;
var dataPanelDataStore = window.dataPanelDataStore;
var displayAreaDataStore = window.displayAreaDataStore;
	
	var componentMixin = {
		removeCard: function removeCard() {
			var that = this;
			return function () {
				// if (that.interactable) {
				//   that.interactable.unset();
				//   that.interactable = null;
				// }
				// if (that.interactDrag) {
				//   that.interactDrag.unset();
				//   that.interactDrag = null;
				// }
				// if (that.interactDrop) {
				//   that.interactDrop.unset();
				//   that.interactDrop = null;
				// }
				var currentStatus = pageStatusDataStore.getCurrentStatus();

				if (currentStatus === "INIT" || this.props.card.type !== "ITEM" || currentStatus.indexOf(this.props.card.FACTOR_NAME[0]) < 0) {

					displayAreaChangeActions.displayAreaRemoveCardAction(currentStatus, that.props.card.id);
				} else {

					message.warning('Can\'t remove object card which is being analyzed.');
				}
			};
		}
	};

	var CreateObjCard = React.createClass({
		displayName: "CreateObjCard",

		mixins: [componentMixin],

		getInitialState: function getInitialState() {
			var editObj = this.props.card.editObj;
			if (editObj === 0) {
				return {
					step: 0,
					status: 'process',
					btnTextLeft: 'Cancel',
					btnTextRight: 'Next',
					dataStep0: {
						type: [],
						techName: '',
						busiName: '',
						freq: "2",
						pin: false
					},
					dataStep1: {
						objList: [],
						skip: true
					}
				};
			} else {

				var item = this.props.card.objList;
				var itemLen = item.length;

				for (var i = 0; i < itemLen; i++) {

					if (item[i].FACTOR_GUID.toString() === editObj) {

						var type1 = [item[i].FACTOR_CATEGORY, item[i].FACTOR_TYPE];
						return {
							step: 0,
							status: 'process',
							btnTextLeft: 'Cancel',
							btnTextRight: 'Next',
							dataStep0: {
								type: type1,
								techName: item[i].FACTOR_NAME,
								busiName: item[i].FACTOR_BUSINESS_NAME,
								freq: "2",
								pin: item[i].PIN === 'X' ? true : false
							},
							dataStep1: {
								objList: [],
								skip: true
							}
						};
					}
				}
			}
		},

		componentDidMount: function componentDidMount() {
			this.interactDrag = global.setCardDragable(this.getDOMNode(), this.props.card.id);
			global.handleFocus(this.getDOMNode());
		},
		componentWillUpdate: function componentWillUpdate() {
			global.resetPosition(this.getDOMNode());
		},
		doNothing: function doNothing() {
			return;
		},
		onBack: function onBack() {
			if (this.state.step === 0) {

				this.removeCard();
			} else if (this.state.step === 1) {
				if (this.refs.step1.checkValidity()) {
					this.setState({
						step: this.state.step - 1,
						status: 'process',
						btnTextLeft: 'Cancel',
						dataStep1: {
							objList: this.refs.step1.state.objList,
							skip: this.refs.step1.state.skip
						}
					});
				} else {
					this.setState({
						status: 'error'
					});
				}
			} else if (this.state.step === 2) {
				this.setState({
					step: this.state.step - 1,
					btnTextRight: 'Next'
				});
			}
		},
		onNext: function onNext() {
			var that = this;
			if (this.state.step === 2) {

				if (!this.state.dataStep1.skip) {
					var factorStr = "";
					var objList = this.state.dataStep1.objList;
					var objLen = objList.length;

					for (var i = 0; i < objLen; i++) {
						factorStr = factorStr + objList[i] + ",";
					}
					factorStr = factorStr.substr(0, factorStr.length - 1);
				} else {
					var factorStr = "0";
				}

				var editObj = this.props.card.editObj;
				var dataInfo = {

					"factorId": editObj === 0 ? "0" : editObj,
					"factorType": this.state.dataStep0.type[1],
					"factorTechName": this.state.dataStep0.techName,
					"sysID": "KEV",
					"factorBusiName": this.state.dataStep0.busiName,
					"factorStat": "A",
					"factorCategory": this.state.dataStep0.type[0],
					"sysClient": "001",
					"checkPin": this.state.dataStep0.pin ? "X" : "",
					"factorString": factorStr

				};

				if (displayAreaDataStore.createObject(dataInfo)) {
					this.setState({
						step: this.state.step + 1,
						status: 'process',
						btnTextLeft: '',
						btnTextRight: 'Close'
					});
					dataPanelDataStore.getInitPageData("INIT");
				} else {
					this.setState({
						status: 'error'
					});
				}
			} else if (this.state.step === 1) {

				if (this.refs.step1.checkValidity()) {
					this.setState({
						step: this.state.step + 1,
						status: 'process',
						btnTextRight: 'Submit',
						dataStep1: {
							objList: this.refs.step1.state.objList,
							skip: this.refs.step1.state.skip
						}
					});
				} else {
					this.setState({
						status: 'error'
					});
				}
			} else if (this.state.step === 0) {
				var dataStep0 = this.refs.step0.getFieldsValue();

				this.refs.step0.validateFields(function (errors, values) {
					if (!!errors) {

						that.setState({
							status: 'error'
						});
					} else {
						that.setState({
							step: that.state.step + 1,
							status: 'process',
							btnTextLeft: 'Back',
							dataStep0: {
								type: dataStep0.type,
								techName: dataStep0.techName,
								busiName: dataStep0.busiName,
								freq: dataStep0.freq,
								pin: dataStep0.pin
							}
						});
					}
				});
				return false;
				/*this.setState({
    	step: this.state.step + 1,
    	btnTextLeft: 'Back',
    	dataStep0: {
    		type: dataStep0.type,
    		techName: dataStep0.techName,
    		busiName: dataStep0.busiName,
    		freq: dataStep0.freq,
    		pin: dataStep0.pin
    	}
    });*/
			}
		},
		render: function render() {
			var FormItem = Form.Item;
			var Option = Select.Option;
			var RadioButton = Radio.Button;
			var RadioGroup = Radio.Group;
			var Step = Steps.Step;
			var ButtonGroup = Button.Group;

			var displayStep;
			switch (this.state.step) {
				case 0:
					{
						displayStep = React.createElement(CreateCardStep0, { ref: "step0", formData: this.state.dataStep0, content: this.props.card, editObj: this.props.card.editObj === 0 ? false : true });
						break;
					}
				case 1:
					{
						displayStep = React.createElement(CreateCardStep1, { ref: "step1", formData: this.state.dataStep1, content: this.props.card });
						break;
					}
				case 2:
					{
						displayStep = React.createElement(CreateCardStep2, { ref: "step2", formData: this.state.dataStep0 });
						break;
					}
				case 3:
					{
						displayStep = React.createElement(CreateCardStep3, { ref: "step3", formData: this.state.dataStep0, editObj: this.props.card.editObj === 0 ? false : true });
						break;
					}
				default:
					;

			}

			return React.createElement(
				Card,
				{ className: "create-obj-card",
					title: this.props.card.title,
					style: this.props.card.style,
					extra: React.createElement(Icon, { type: "cross", onClick: this.removeCard().bind(this) }) },
				React.createElement(
					Steps,
					{ size: "small", current: this.state.step, status: this.state.status },
					React.createElement(Step, { title: "Basic Info" }),
					React.createElement(Step, { title: "Relation" }),
					React.createElement(Step, { title: "Confirmation" }),
					React.createElement(Step, { title: "Finish" })
				),
				displayStep,
				React.createElement(
					ButtonGroup,
					{ style: { marginTop: 20 } },
					React.createElement(
						Button,
						{ type: "primary", onClick: this.state.step === 0 ? this.removeCard().bind(this) : this.onBack },
						React.createElement(Icon, { type: "left" }),
						this.state.btnTextLeft
					),
					React.createElement(
						Button,
						{ type: "primary", htmlType: "submit", onClick: this.state.step === 3 ? this.removeCard().bind(this) : this.onNext },
						this.state.btnTextRight,
						React.createElement(Icon, { type: "right" })
					)
				)
			);
		}
	});

export default CreateObjCard