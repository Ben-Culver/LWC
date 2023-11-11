import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WatchAndToast extends LightningElement {
    _recordId;
    startingValue;
    updatedValue;
    @api triggerValue;
    @api changeMessage;
    @api objectName;
    @api triggerField;
    theField = {};
    
    connectedCallback() {
        this.theField = {
            objectApiName: this.objectName,
            fieldApiName: this.triggerField
        };
    }

    @api
    get recordId() {
        return this._recordId;
    }

    set recordId(value) {
        this._recordId = value;
        this.startingValue = null;
        this.updatedValue = null;
    }

    get fields() {
        return [this.theField];
    }

    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    opportunity({error, data}) {
        if (error) {
        } else if (data && this.triggerField != null) {
            if(this.startingValue == null) {
                this.startingValue = data.fields[this.triggerField].value;
            } else {
                this.updatedValue = this.startingValue == data.fields[this.triggerField].value ? null : data.fields[this.triggerField].value;               
                if(this.updatedValue == this.triggerValue) {
                    const evt = new ShowToastEvent({
                        title: 'Success',
                        message: this.changeMessage,
                        variant: 'success'
                    });
                    this.dispatchEvent(evt);
                    this.startingValue = this.updatedValue;
                    this.updatedValue = null;
                }
                this.startingValue = data.fields[this.triggerField].value;
            }
        }
    }
}